import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

actor {
  type Experience = {
    company : Text;
    role : Text;
    duration : Text;
    description : Text;
  };

  type Project = {
    title : Text;
    description : Text;
    link : ?Text;
  };

  type Contact = {
    platform : Text;
    url : Text;
  };

  type Profile = {
    name : Text;
    title : Text;
    tagline : Text;
    bio : Text;
    skills : [Text];
    experience : [Experience];
    projects : [Project];
    contacts : [Contact];
  };

  var name : Text = "";
  var title : Text = "";
  var tagline : Text = "";
  var bio : Text = "";

  let skills = List.empty<Text>();
  let experience = List.empty<Experience>();
  let projects = List.empty<Project>();
  let contacts = List.empty<Contact>();

  // Update profile sections
  public shared ({ caller }) func updateBasicInfo(newName : Text, newTitle : Text, newTagline : Text, newBio : Text) : async () {
    name := newName;
    title := newTitle;
    tagline := newTagline;
    bio := newBio;
  };

  public shared ({ caller }) func updateSkills(newSkills : [Text]) : async () {
    skills.clear();
    skills.addAll(newSkills.values());
  };

  public shared ({ caller }) func updateExperience(newExperience : [Experience]) : async () {
    experience.clear();
    experience.addAll(newExperience.values());
  };

  public shared ({ caller }) func updateProjects(newProjects : [Project]) : async () {
    projects.clear();
    projects.addAll(newProjects.values());
  };

  public shared ({ caller }) func updateContacts(newContacts : [Contact]) : async () {
    contacts.clear();
    contacts.addAll(newContacts.values());
  };

  // Get full profile
  public query ({ caller }) func getProfile() : async Profile {
    {
      name;
      title;
      tagline;
      bio;
      skills = skills.toArray();
      experience = experience.toArray();
      projects = projects.toArray();
      contacts = contacts.toArray();
    };
  };
};
