/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: LeaseCollectionAPIResponseFields
// ====================================================

export interface LeaseCollectionAPIResponseFields_data_leases_occupant_doc_auth_info {
  __typename: "CasAuthInfo";
  cas_id: string | null;
  institution_id: string | null;
}

export interface LeaseCollectionAPIResponseFields_data_leases_occupant_doc_user_settings_push_subscriptions_keys {
  __typename: "PushSubscriptionKeys";
  p256dh: string;
  auth: string;
}

export interface LeaseCollectionAPIResponseFields_data_leases_occupant_doc_user_settings_push_subscriptions {
  __typename: "PushSubscription";
  endpoint: string;
  keys: LeaseCollectionAPIResponseFields_data_leases_occupant_doc_user_settings_push_subscriptions_keys;
}

export interface LeaseCollectionAPIResponseFields_data_leases_occupant_doc_user_settings {
  __typename: "StudentUserSettings";
  recieve_email_notifications: boolean;
  push_subscriptions: LeaseCollectionAPIResponseFields_data_leases_occupant_doc_user_settings_push_subscriptions[];
}

export interface LeaseCollectionAPIResponseFields_data_leases_occupant_doc_search_status {
  __typename: "SearchStatus";
  date_updated: string;
  searching: boolean;
  search_start: string | null;
  search_end: string | null;
  price_start: number | null;
  price_end: number | null;
}

export interface LeaseCollectionAPIResponseFields_data_leases_occupant_doc {
  __typename: "Student";
  _id: string;
  first_name: string;
  phone_number: string;
  last_name: string;
  email: string;
  elevated_privileges: string[] | null;
  auth_info: LeaseCollectionAPIResponseFields_data_leases_occupant_doc_auth_info | null;
  user_settings: LeaseCollectionAPIResponseFields_data_leases_occupant_doc_user_settings | null;
  search_status: LeaseCollectionAPIResponseFields_data_leases_occupant_doc_search_status | null;
}

export interface LeaseCollectionAPIResponseFields_data_leases_priority {
  __typename: "LeasePriority";
  level: number;
  start_date: string;
  end_date: string;
}

export interface LeaseCollectionAPIResponseFields_data_leases {
  __typename: "Lease";
  _id: string;
  active: boolean;
  ownership_id: string;
  price_per_month: number;
  occupant_id: string | null;
  occupant_doc: LeaseCollectionAPIResponseFields_data_leases_occupant_doc | null;
  external_occupant: boolean;
  priority: LeaseCollectionAPIResponseFields_data_leases_priority | null;
  lease_document_id: string | null;
  lease_availability_start_date: string | null;
  lease_availability_end_date: string | null;
}

export interface LeaseCollectionAPIResponseFields_data {
  __typename: "LeaseCollection";
  leases: LeaseCollectionAPIResponseFields_data_leases[];
}

export interface LeaseCollectionAPIResponseFields {
  __typename: "LeaseCollectionAPIResponse";
  success: boolean;
  error: string | null;
  data: LeaseCollectionAPIResponseFields_data | null;
}
