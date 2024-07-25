import { Membership } from "../entities/membershipData";

export interface MembershipResponse {
  success: boolean;
  memberships: Membership[];
}
