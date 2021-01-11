/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: StudentAPIResponseFields
// ====================================================

export interface StudentAPIResponseFields_data_auth_info {
  __typename: "CasAuthInfo";
  cas_id: string | null;
  institution_id: string | null;
}

export interface StudentAPIResponseFields_data_user_settings_push_subscriptions_keys {
  __typename: "PushSubscriptionKeys";
  p256dh: string;
  auth: string;
}

export interface StudentAPIResponseFields_data_user_settings_push_subscriptions {
  __typename: "PushSubscription";
  endpoint: string;
  keys: StudentAPIResponseFields_data_user_settings_push_subscriptions_keys;
}

export interface StudentAPIResponseFields_data_user_settings {
  __typename: "StudentUserSettings";
  recieve_email_notifications: boolean;
  push_subscriptions: StudentAPIResponseFields_data_user_settings_push_subscriptions[];
}

export interface StudentAPIResponseFields_data {
  __typename: "Student";
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  elevated_privileges: string[] | null;
  auth_info: StudentAPIResponseFields_data_auth_info | null;
  user_settings: StudentAPIResponseFields_data_user_settings | null;
}

export interface StudentAPIResponseFields {
  __typename: "StudentAPIResponse";
  data: StudentAPIResponseFields_data | null;
  success: boolean;
  error: string | null;
}
