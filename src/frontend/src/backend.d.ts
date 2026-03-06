import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Profile {
    bio: string;
    title: string;
    contacts: Array<Contact>;
    tagline: string;
    projects: Array<Project>;
    name: string;
    experience: Array<Experience>;
    skills: Array<string>;
}
export interface Project {
    title: string;
    link?: string;
    description: string;
}
export interface Experience {
    duration: string;
    role: string;
    description: string;
    company: string;
}
export interface Contact {
    url: string;
    platform: string;
}
export interface backendInterface {
    getProfile(): Promise<Profile>;
    updateBasicInfo(newName: string, newTitle: string, newTagline: string, newBio: string): Promise<void>;
    updateContacts(newContacts: Array<Contact>): Promise<void>;
    updateExperience(newExperience: Array<Experience>): Promise<void>;
    updateProjects(newProjects: Array<Project>): Promise<void>;
    updateSkills(newSkills: Array<string>): Promise<void>;
}
