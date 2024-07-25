export interface UserData {
  uid?: string;
  username?: string;
  email?: string,
  is_admin?: boolean,
  program?: string;
  student_code?: string;
  photo_url?: string;
  phone?: string;
  student_code_edited?: boolean;
  program_edited?: boolean;
  phone_edited?: boolean;
  access?:string;
  refresh?:string;
}