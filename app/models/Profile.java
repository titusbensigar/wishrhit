
package models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import play.Logger;
import play.data.format.Formats;
import play.db.jpa.JPA;
import play.db.jpa.TransactionalAction;


@Entity
@Table(name="LoginDetails")
@NamedQuery(name="Profile.findAll", query="SELECT p FROM Profile p")
public class Profile extends TransactionalAction{

	@GeneratedValue(strategy=GenerationType.AUTO)
	@Id
	@Column(name="profile_id")
	public Long profileId;
	
	@Column(name="email")
    public String email;
	
	@Column(name="fullname")
    public String fullname;

    @Column(name="phone")
    public String phone;
    
    @Formats.DateTime(pattern="MM/dd/yyyy")
    @Column(name="createddate")
    public Date createdDate;
    @Formats.DateTime(pattern="MM/dd/yyyy")
    @Column(name="modifieddate")
    public Date modifiedDate;

    public boolean createProfile(String email,String fullname, String phone) {
    	boolean isCreated = false;
    	try {
    		this.email = email;
    		this.fullname = fullname;
    		this.phone = phone;
			Date dt = new Date();
			this.createdDate = dt;
			this.modifiedDate = dt;
			JPA.em().persist(this);
			isCreated = true;
    		
    	} catch (Exception e) {
			// TODO Auto-generated catch block
    		Logger.error("error while creating profile");
			e.printStackTrace();
		}
    	return isCreated;
    }
}
