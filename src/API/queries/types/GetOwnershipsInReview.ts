/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOwnershipsInReview
// ====================================================

export interface GetOwnershipsInReview_getOwnershipsInReview_data_ownerships_confirmation_activity {
  __typename: "ConfirmationActivity";
  user_id: string;
  user_type: string;
  message: string;
  date_submitted: string;
  full_name: string | null;
}

export interface GetOwnershipsInReview_getOwnershipsInReview_data_ownerships_property_doc_details_property_images {
  __typename: "PropertyImageInfo";
  s3_key: string;
  date_uploaded: string;
}

export interface GetOwnershipsInReview_getOwnershipsInReview_data_ownerships_property_doc_details {
  __typename: "PropertyDetails";
  description: string;
  rooms: number;
  bathrooms: number;
  sq_ft: number;
  furnished: boolean;
  has_washer: boolean;
  has_heater: boolean;
  has_ac: boolean;
  property_images: GetOwnershipsInReview_getOwnershipsInReview_data_ownerships_property_doc_details_property_images[];
}

export interface GetOwnershipsInReview_getOwnershipsInReview_data_ownerships_property_doc {
  __typename: "Property";
  _id: string;
  address_line: string;
  address_line_2: string | null;
  city: string;
  state: string;
  zip: string;
  landlord: string;
  details: GetOwnershipsInReview_getOwnershipsInReview_data_ownerships_property_doc_details | null;
}

export interface GetOwnershipsInReview_getOwnershipsInReview_data_ownerships_landlord_doc {
  __typename: "Landlord";
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
}

export interface GetOwnershipsInReview_getOwnershipsInReview_data_ownerships_ownership_documents {
  __typename: "OwnershipDocument";
  s3_doc_key: string;
  format: string;
  date_uploaded: string;
}

export interface GetOwnershipsInReview_getOwnershipsInReview_data_ownerships_status_change_history {
  __typename: "StatusChangeInfo";
  status_changer_user_id: string;
  status_changer_user_type: string;
  date_changed: string;
  changed_from: string;
  changed_to: string;
  status_changer_full_name: string | null;
}

export interface GetOwnershipsInReview_getOwnershipsInReview_data_ownerships {
  __typename: "Ownership";
  _id: string;
  property_id: string | null;
  confirmation_activity: GetOwnershipsInReview_getOwnershipsInReview_data_ownerships_confirmation_activity[];
  property_doc: GetOwnershipsInReview_getOwnershipsInReview_data_ownerships_property_doc | null;
  landlord_id: string;
  landlord_doc: GetOwnershipsInReview_getOwnershipsInReview_data_ownerships_landlord_doc | null;
  date_submitted: string;
  status: string;
  ownership_documents: GetOwnershipsInReview_getOwnershipsInReview_data_ownerships_ownership_documents[];
  status_change_history: GetOwnershipsInReview_getOwnershipsInReview_data_ownerships_status_change_history[];
}

export interface GetOwnershipsInReview_getOwnershipsInReview_data {
  __typename: "OwnershipCollection";
  ownerships: GetOwnershipsInReview_getOwnershipsInReview_data_ownerships[];
}

export interface GetOwnershipsInReview_getOwnershipsInReview {
  __typename: "OwnershipCollectionAPIResponse";
  success: boolean;
  error: string | null;
  data: GetOwnershipsInReview_getOwnershipsInReview_data | null;
}

export interface GetOwnershipsInReview {
  getOwnershipsInReview: GetOwnershipsInReview_getOwnershipsInReview;
}
