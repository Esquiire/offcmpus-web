/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CheckEligibleForLeaseAgreement
// ====================================================

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_occupant_doc_auth_info {
  __typename: "CasAuthInfo";
  cas_id: string | null;
  institution_id: string | null;
}

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_occupant_doc_user_settings_push_subscriptions_keys {
  __typename: "PushSubscriptionKeys";
  p256dh: string;
  auth: string;
}

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_occupant_doc_user_settings_push_subscriptions {
  __typename: "PushSubscription";
  endpoint: string;
  keys: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_occupant_doc_user_settings_push_subscriptions_keys;
}

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_occupant_doc_user_settings {
  __typename: "StudentUserSettings";
  recieve_email_notifications: boolean;
  push_subscriptions: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_occupant_doc_user_settings_push_subscriptions[];
}

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_occupant_doc_search_status {
  __typename: "SearchStatus";
  date_updated: string;
  searching: boolean;
  search_start: string | null;
  search_end: string | null;
  price_start: number | null;
  price_end: number | null;
}

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_occupant_doc {
  __typename: "Student";
  _id: string;
  first_name: string;
  phone_number: string | null;
  last_name: string;
  email: string;
  elevated_privileges: string[] | null;
  auth_info: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_occupant_doc_auth_info | null;
  user_settings: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_occupant_doc_user_settings | null;
  search_status: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_occupant_doc_search_status | null;
}

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_priority {
  __typename: "LeasePriority";
  level: number;
  start_date: string;
  end_date: string;
}

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_lease_history_review_of_property {
  __typename: "ReviewAndResponse";
  rating: number;
  review: string;
  response: string | null;
}

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_lease_history_review_of_landlord {
  __typename: "ReviewAndResponse";
  rating: number;
  review: string;
  response: string | null;
}

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_lease_history_property_images {
  __typename: "LeaseImageInfo";
  s3_key: string;
  date_uploaded: string;
}

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_lease_history {
  __typename: "LeaseHistory";
  price: number;
  student_id: string;
  start_date: string;
  end_date: string;
  review_of_property: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_lease_history_review_of_property | null;
  review_of_landlord: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_lease_history_review_of_landlord | null;
  property_images: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_lease_history_property_images[];
}

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_student_interests {
  __typename: "StudentInterest";
  student_id: string;
  date: string;
  accepted: boolean | null;
}

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_students_that_declined {
  __typename: "DeclineInfo";
  date: string;
  student_id: string;
}

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data {
  __typename: "Lease";
  _id: string;
  active: boolean;
  ownership_id: string;
  price_per_month: number;
  occupant_id: string | null;
  occupant_doc: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_occupant_doc | null;
  external_occupant: boolean;
  priority: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_priority | null;
  lease_document_id: string | null;
  lease_availability_start_date: string | null;
  lease_availability_end_date: string | null;
  lease_history: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_lease_history[];
  student_interests: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_student_interests[];
  students_that_declined: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data_students_that_declined[] | null;
}

export interface CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement {
  __typename: "LeaseAPIResponse";
  success: boolean;
  error: string | null;
  data: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement_data | null;
}

export interface CheckEligibleForLeaseAgreement {
  checkEligibleForLeaseAgreement: CheckEligibleForLeaseAgreement_checkEligibleForLeaseAgreement;
}

export interface CheckEligibleForLeaseAgreementVariables {
  lease_id: string;
  student_id: string;
}
