package controllers;
import java.util.Date;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;

import com.fasterxml.jackson.databind.JsonNode;
/**
 * @author Titus Bensigar
 */
import com.fasterxml.jackson.databind.node.ObjectNode;

import models.Login;
import models.Profile;
import play.Logger;
import play.Play;
import play.api.libs.Crypto;
import play.db.jpa.JPA;
import play.db.jpa.Transactional;
import play.i18n.Messages;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import util.ApplicationConstants;

public class Application extends Controller {
	public static String randomCodeKey = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	
    @Transactional
    public Result firstLogin() {
        Logger.info("Lgin First login ###########...................");

        JsonNode json = null;
        Login login = null;
        Login tmpLogin = null;
        ObjectNode errors = Json.newObject();
        ObjectNode result = Json.newObject();
        boolean flag = false;
        try {
            json = request().body().asJson();
            Logger.info("username-"+json.get("username").asText());
            try {
            	login = JPA
                        .em()
                        .createQuery(
                                "select u from Login u where u.email = :username",
                                Login.class).setParameter("username", json.get("username").asText()).getSingleResult();
            	Logger.info("login-"+login);
                if (login != null) {
                	if(login.checkPassword(json.get("password").asText())) {
                		Logger.info("authenticated-"+login);
                		tmpLogin = login;
                	}
                }
                Logger.info("tmpLogin"+tmpLogin);
                if (tmpLogin != null) {
                	if(tmpLogin.resetPassword) {
                		//show reset password page
                		result.put("resetpass", true);
                	} 
                    // session();
                    session().clear();
                    session(ApplicationConstants.SES_USER_ID, "" + tmpLogin.loginId);
                    session(ApplicationConstants.SES_LOGIN_TIME, String.valueOf(new Date().getTime()));
                    session("lastActive", "" + System.currentTimeMillis());
                    // session("XSRF-TOKEN", Crypto.generateSignedToken());
                    session(ApplicationConstants.SES_UUID, java.util.UUID.randomUUID().toString());
                } else {
                    // form.reject("username", Messages.get("E_10002_3"));
                    errors.put("username", Messages.get("E_10002_3"));

                }
                Logger.info("authentication completed");
            } catch (Exception e) {
            	Logger.error("authenticate exception -"+login);
            	e.printStackTrace();
                errors.put("username", Messages.get("E_10002_3"));
            }
            Logger.info("authentication errors.size() " + errors.size());
            if (errors.size() == 0) {
            	Logger.info("authentication errors.size() 333333" + errors.size());
                response().setCookie(ApplicationConstants.XSRF_TOKEN, play.Play.application().injector().instanceOf(Crypto.class).generateSignedToken());
                Logger.info("authentication errors.size() 44444" + errors.size());
                // int maxAge,
                // java.lang.String path,
                // java.lang.String domain,
                // boolean secure,
                // boolean httpOnly
                //
                result.put("result", "SUCCESS");
                result.put(ApplicationConstants.SES_LOGIN_TIME, session(ApplicationConstants.SES_LOGIN_TIME));
                return ok(result);
            } else {
                session().clear();
                return ok(errors);
            }

        } catch (Exception e) {
        	Logger.error("Login exception -"+login);
        	e.printStackTrace();
            Logger.error("Login Exception : ", e);
            return badRequest("Error");
        } finally {
            json = null;
            errors = null;
            tmpLogin = null;
        }
    }
    
    @Transactional
    public Result resetPass() {
        Logger.info("resetPass ###########...................");

        JsonNode json = null;
        Login login = null;
        ObjectNode errors = Json.newObject();
        ObjectNode result = Json.newObject();
        boolean flag = false;
        try {
            json = request().body().asJson();
            Logger.info("email-"+json.get("remail").asText());
            try {
            	login = JPA
                        .em()
                        .createQuery(
                                "select u from Login u where u.email = :email",
                                Login.class).setParameter("email", json.get("remail").asText()).getSingleResult();
            	Logger.info("login-"+login);
                if (login != null) {
                	if(login.checkPassword(json.get("oldpassword").asText())) {
                		Logger.info("authenticated-"+login);
        	    		login.setNewPassword(json.get("newpassword").asText());
        	    		login.resetPassword = false;
    					JPA.em().persist(login);
    					sendEmail(json.get("remail").asText(),login.profile.fullname,Messages.get("email.reset.subject"),3, null);
                	}
                }
                
                Logger.info("authentication completed");
            } catch (Exception e) {
            	Logger.error("authenticate exception -"+login);
            	e.printStackTrace();
                errors.put("username", Messages.get("E_10002_3"));
            }
            Logger.info("authentication errors.size() " + errors.size());
            if (errors.size() == 0) {
            	Logger.info("authentication errors.size() 333333" + errors.size());
                response().setCookie(ApplicationConstants.XSRF_TOKEN, play.Play.application().injector().instanceOf(Crypto.class).generateSignedToken());
                Logger.info("authentication errors.size() 44444" + errors.size());
                // int maxAge,
                // java.lang.String path,
                // java.lang.String domain,
                // boolean secure,
                // boolean httpOnly
                //
                result.put("result", "SUCCESS");
                result.put(ApplicationConstants.SES_LOGIN_TIME, session(ApplicationConstants.SES_LOGIN_TIME));
                return ok(result);
            } else {
                session().clear();
                return ok(errors);
            }

        } catch (Exception e) {
        	Logger.error("Login exception -"+login);
        	e.printStackTrace();
            Logger.error("Login Exception : ", e);
            return badRequest("Error");
        } finally {
            json = null;
            errors = null;
        }
    }
    
    @Transactional
    public Result forgotPass() {
        Logger.info("forgotPass ###########...................");

        JsonNode json = null;
        Login login = null;
        Login tmpLogin = null;
        ObjectNode errors = Json.newObject();
        ObjectNode result = Json.newObject();
        boolean flag = false;
        try {
            json = request().body().asJson();
            Logger.info("email-"+json.get("femail").asText());
            try {
            	login = JPA
                        .em()
                        .createQuery(
                                "select u from Login u where u.email = :email",
                                Login.class).setParameter("email", json.get("femail").asText()).getSingleResult();
            	Logger.info("login-"+login);
                if (login != null) {
                	String str = RandomStringUtils.random(8,randomCodeKey);
    	    		Logger.info("str: " + str);
    	    		login.setNewPassword(str);
    	    		login.resetPassword = true;
					JPA.em().persist(login);
					sendEmail(json.get("femail").asText(),login.profile.fullname,Messages.get("email.forgot.subject"),2, str);
                }
                
                Logger.info("authentication completed");
            } catch (Exception e) {
            	Logger.error("authenticate exception -"+login);
            	e.printStackTrace();
                errors.put("username", Messages.get("E_10002_3"));
            }
            Logger.info("authentication errors.size() " + errors.size());
            if (errors.size() == 0) {
            	Logger.info("authentication errors.size() 333333" + errors.size());
                response().setCookie(ApplicationConstants.XSRF_TOKEN, play.Play.application().injector().instanceOf(Crypto.class).generateSignedToken());
                Logger.info("authentication errors.size() 44444" + errors.size());
                // int maxAge,
                // java.lang.String path,
                // java.lang.String domain,
                // boolean secure,
                // boolean httpOnly
                //
                result.put("result", "SUCCESS");
                result.put(ApplicationConstants.SES_LOGIN_TIME, session(ApplicationConstants.SES_LOGIN_TIME));
                return ok(result);
            } else {
                session().clear();
                return ok(errors);
            }

        } catch (Exception e) {
        	Logger.error("Login exception -"+login);
        	e.printStackTrace();
            Logger.error("Login Exception : ", e);
            return badRequest("Error");
        } finally {
            json = null;
            errors = null;
            tmpLogin = null;
        }
    }
    
    @Transactional
    public Result signup() {
        Logger.info("Signup ###########...................");

        JsonNode json = null;
        Login login = null;
        Profile profile = null;
        ObjectNode errors = Json.newObject();
        ObjectNode result = Json.newObject();
        boolean flag = false;
        try {
            json = request().body().asJson();
            Logger.info("fullname-"+json.get("fullname").asText());
            try {
            	try {
            	login = JPA
                        .em()
                        .createQuery(
                                "select u from Login u where u.email = :email",
                                Login.class).setParameter("email", json.get("email").asText()).getSingleResult();
            	}catch (Exception e) {
            		e.printStackTrace();
            	}
            	Logger.info("login-"+login);
                if (login == null) {
                	//No user found
                	profile = new Profile();
                	boolean state = profile.createProfile(json.get("email").asText(), json.get("fullname").asText(), json.get("phone").asText());
                	if(state) {
                		login = new Login();
                		flag = login.createLogin(json.get("email").asText(), json.get("spassword").asText());
                	}
                } 
                Logger.info("login===="+login);
                if (login != null && flag) {
                    // session();
                    session().clear();
                    session(ApplicationConstants.SES_USER_ID, "" + login.loginId);
                    session(ApplicationConstants.SES_LOGIN_TIME, String.valueOf(new Date().getTime()));
                    session("lastActive", "" + System.currentTimeMillis());
                    // session("XSRF-TOKEN", Crypto.generateSignedToken());
                    session(ApplicationConstants.SES_UUID, java.util.UUID.randomUUID().toString());
                    sendEmail(json.get("email").asText(),json.get("fullname").asText(),Messages.get("email.registration.subject"),1, null);
                } else {
                    // form.reject("username", Messages.get("E_10002_3"));
                    errors.put("username", Messages.get("E_10002_3"));

                }
                Logger.info("authentication completed");
            } catch (Exception e) {
            	Logger.error("authenticate exception -"+login);
            	e.printStackTrace();
                errors.put("username", Messages.get("E_10002_3"));
            }
            Logger.info("authentication errors.size() " + errors.size());
            if (errors.size() == 0) {
            	Logger.info("authentication errors.size() 333333" + errors.size());
                response().setCookie(ApplicationConstants.XSRF_TOKEN, play.Play.application().injector().instanceOf(Crypto.class).generateSignedToken());
                Logger.info("authentication errors.size() 44444" + errors.size());
                // int maxAge,
                // java.lang.String path,
                // java.lang.String domain,
                // boolean secure,
                // boolean httpOnly
                //
                result.put("result", "SUCCESS");
                result.put(ApplicationConstants.SES_LOGIN_TIME, session(ApplicationConstants.SES_LOGIN_TIME));
                return ok(result);
            } else {
                session().clear();
                return ok(errors);
            }

        } catch (Exception e) {
        	Logger.error("Login exception -"+login);
        	e.printStackTrace();
            Logger.error("Login Exception : ", e);
            return badRequest("Error");
        } finally {
            json = null;
            errors = null;
        }
    }
    
    private boolean sendEmail(String email, String name, String subject, int type,String others) {
    	try {
	    	HtmlEmail emailObj = new HtmlEmail();
			emailObj.setHostName(Play.application().configuration().getString("mail.smtp.host"));
			emailObj.setAuthentication(Play.application().configuration().getString("mail.smtp.user"), Play.application().configuration().getString("mail.smtp.pass"));
			emailObj.setSSL(true);
			emailObj.setSmtpPort(Play.application().configuration().getInt("mail.smtp.port"));
			emailObj.addTo(email);
			
				emailObj.setFrom(Play.application().configuration().getString("mail.smtp.user"), "WishRHit");
			
			emailObj.setSubject(subject);
			// embed the image and get the content id
			StringBuffer msg = new StringBuffer();
	    	msg.append("<html>Hello ").append(name).append(", <br/><br/>This is an automated email, please don't reply.<br/><hr style='border: 1px dotted #999; border-style: none none dotted; color: #fff; background-color: #fff;' /><br/><br/> ");
	//    			.append("<br/>Someone entered your email on the 'Forgot Password' screen at MyVoice.");
	//    	msg.append("<br/> ").append("<br/><hr style='border: 1px dotted #ff0000; border-style: none none dotted; color: #fff; background-color: #fff;' /><br/>Temporary Password: " )
	//    			.append(str)
	    		switch(type) {
	    		case 1: //Registration
	    			msg.append(Messages.get("email.registration.body"))
	    			.append("Your username: " + email);
	    			break;
	    		case 2: //Forgot Password
	    			msg.append(Messages.get("email.forgot.body"))
	    			.append(others);
	    			break;
	    		case 3: //Reset Password
	    			msg.append(Messages.get("email.reset.body"));
	    			break;
	    		}
	    	msg.append( "<br/><hr style='border: 1px dotted #ff0000; border-style: none none dotted; color: #fff; background-color: #fff;' /><br/>")
	    			.append("<br/><br/>If this wasn't you, there is no need to take any action.<br/><br/>")
	    			.append("Regards,<br/> WishRHit Team</html>");
			// set the html message
	    	emailObj.setHtmlMsg(msg.toString());
			// set the alternative message
	    	emailObj.setTextMsg("Your email client does not support HTML messages, too bad :(");
	    	emailObj.send();
	    	Logger.info("email: " + msg.toString());
	    	return true;
    	} catch (EmailException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	return false;
    }
}
