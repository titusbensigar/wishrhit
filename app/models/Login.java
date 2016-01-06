/**
 * 
 */
package models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.NamedQuery;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import play.Logger;
import play.data.format.Formats;
import play.data.validation.Constraints.Required;
import play.db.jpa.JPA;
import play.db.jpa.TransactionalAction;
import util.PasswordUtils;

/**
 * @author Titus Bensigar
 *
 */
@Entity
@Table(name="Login")
@NamedQuery(name="Login.findAll", query="SELECT l FROM Login l")
public class Login  extends TransactionalAction {

	@GeneratedValue(strategy=GenerationType.AUTO)
	@Id
	@Column(name="login_id")
	public Long loginId;
	
	@Required
    public String email;
	
    public String password;
	
	@Column(name="passwordencrypted",columnDefinition="BINARY(20)")
    public byte[] passwordEncrypted;
    
    @Column(columnDefinition="BINARY(16)")
    public byte[] salt;
    
    @Formats.DateTime(pattern="MM/dd/yyyy")
    @Column(name="createddate")
    public Date createdDate;
    
    @Formats.DateTime(pattern="MM/dd/yyyy")
    @Column(name="modifieddate")
    public Date modifiedDate;
    
    @Column(name="resetpassword")
    public Boolean resetPassword;
    
    @OneToOne
    @JoinColumn(name="login_profile_id",
    referencedColumnName="profile_id")
    public Profile profile; 
    
    public boolean createLogin(String email, String password) {
    	boolean isCreated = false;
    	try {
    		Profile profile = JPA
                    .em()
                    .createQuery(
                            "select u from Profile u where u.email = :email",
                            Profile.class).setParameter("email", email).getSingleResult();
    		Logger.info("profile---" + profile);
    		if(profile != null) {
    			Logger.info("profile-id--" + profile.profileId);
    		
	    		Logger.info("email=" +email );
	        	this.email = email;
				setNewPassword(password);
		    	this.password = null;
		    	this.profile = profile;
				Date dt = new Date();
				this.createdDate = dt;
				this.modifiedDate = dt;
				JPA.em().persist(this);
				isCreated = true;
    		}
    	} catch (Exception e) {
			// TODO Auto-generated catch block
    		Logger.error("error while creating profile");
			e.printStackTrace();
		}
    	return isCreated;
    }
    

	public boolean checkPassword(String unencryptedPassword) {
		// TODO Comment the below block when the  new password encryption strategy to use 
		// return password.equals(Codec.hexMD5(unencryptedPassword));
		
		// TODO Open the below block when the new password encryption strategy to use 
		boolean isAuthenticated = false;
//		Logger.info("password -> "+ password + " ; unencryptedPassword => " + unencryptedPassword);
		Logger.info("passwordEncrypted -> "+ passwordEncrypted );
		if (this.passwordEncrypted == null) {
			if (this.password != null && unencryptedPassword != null) {
				isAuthenticated = this.password.equals(unencryptedPassword);
			}
			Logger.info("isAuthenticated -> "+ isAuthenticated );
			if (isAuthenticated) {
				// If the user is authenticated with the old encrypted password, generate new password
				try {
					setNewPassword(unencryptedPassword);
					this.password = null;
					Logger.info("user in model-" + this);
					Login login = JPA.em().find(Login.class, this.loginId);
					login.password = null;
					login.passwordEncrypted = this.passwordEncrypted;
					login.salt = this.salt;
					JPA.em().persist(login);
				} catch (Exception exception) {
					Logger.error("error while updating user");
					exception.printStackTrace();
				}
			}
			return isAuthenticated;
		} else {
			return PasswordUtils.authenticate(unencryptedPassword, this.passwordEncrypted, this.salt);
		}
    }
    
    public void setNewPassword(String password) throws Exception {
    	// TODO Comment the below block when the  new password encryption strategy to use 
    	 
    	// TODO Open the below block when the new password encryption strategy to use 
    	// Set User Salt
    	setSalt(PasswordUtils.generateSalt());
    	
    	// Set encrypted    	 
    	byte[] encryptedPwd = null;
    	
    	encryptedPwd = PasswordUtils.getEncryptedPassword(password, this.salt);
    	
    	setPasswordEncrypted(encryptedPwd);
    }
    
    public byte[] getPasswordEncrypted() {
		return passwordEncrypted;
	}

	public void setPasswordEncrypted(byte[] passwordEncrypted) {
		this.passwordEncrypted = passwordEncrypted;
	}

	public byte[] getSalt() {
		return salt;
	}

	public void setSalt(byte[] salt) {
		this.salt = salt;
	}
}
