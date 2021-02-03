/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchForProperties
// ====================================================

export interface SearchForProperties_searchForProperties_data_properties_details_property_images {
  __typename: "PropertyImageInfo";
  s3_key: string;
  date_uploaded: string;
}

export interface SearchForProperties_searchForProperties_data_properties_details {
  __typename: "PropertyDetails";
  description: string;
  rooms: number;
  bathrooms: number;
  sq_ft: number;
  furnished: boolean;
  has_washer: boolean;
  has_heater: boolean;
  has_ac: boolean;
  property_images: SearchForProperties_searchForProperties_data_properties_details_property_images[];
}

export interface SearchForProperties_searchForProperties_data_properties_directions_foot_walking_directions {
  __typename: "DirectionCoordinates";
  distance: number;
  coordinates: number[][];
}

export interface SearchForProperties_searchForProperties_data_properties_directions_driving_car_directions {
  __typename: "DirectionCoordinates";
  distance: number;
  coordinates: number[][];
}

export interface SearchForProperties_searchForProperties_data_properties_directions_cycling_regular_directions {
  __typename: "DirectionCoordinates";
  distance: number;
  coordinates: number[][];
}

export interface SearchForProperties_searchForProperties_data_properties_directions {
  __typename: "PropertyDirections";
  institution_id: string;
  foot_walking_directions: SearchForProperties_searchForProperties_data_properties_directions_foot_walking_directions[] | null;
  driving_car_directions: SearchForProperties_searchForProperties_data_properties_directions_driving_car_directions[] | null;
  cycling_regular_directions: SearchForProperties_searchForProperties_data_properties_directions_cycling_regular_directions[] | null;
}

export interface SearchForProperties_searchForProperties_data_properties_leases {
  __typename: "Lease";
  _id: string;
  active: boolean;
  ownership_id: string;
  price_per_month: number;
  external_occupant: boolean;
  lease_availability_end_date: string | null;
  lease_availability_start_date: string | null;
  lease_document_id: string | null;
}

export interface SearchForProperties_searchForProperties_data_properties {
  __typename: "Property";
  _id: string;
  landlord: string;
  address_line: string;
  address_line_2: string | null;
  city: string;
  state: string;
  zip: string;
  details: SearchForProperties_searchForProperties_data_properties_details | null;
  directions: SearchForProperties_searchForProperties_data_properties_directions[] | null;
  leases: SearchForProperties_searchForProperties_data_properties_leases[] | null;
}

export interface SearchForProperties_searchForProperties_data {
  __typename: "PropertyList";
  properties: SearchForProperties_searchForProperties_data_properties[];
}

export interface SearchForProperties_searchForProperties {
  __typename: "PropertyListAPIResponse";
  success: boolean;
  error: string | null;
  data: SearchForProperties_searchForProperties_data | null;
}

export interface SearchForProperties {
  searchForProperties: SearchForProperties_searchForProperties;
}

export interface SearchForPropertiesVariables {
  price_start: number;
  price_end: number;
  rooms: number;
  distance: number;
}
