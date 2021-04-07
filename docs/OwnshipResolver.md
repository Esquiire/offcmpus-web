

/**
  getOwnershipForProperty
  * @desc Find the ownership document that is confirmed for the property with the
  * provided property id.
  */

/**
 * getOwnership
 * @param _id: string => The id for the ownership document we want
 *
 * @desc Return the ownership document for the requested id. If no docunment
 * exists, an error will be returned.
 */


 /**
  * getOwnershipsInReview()
  * @desc Return the list of ownership documents that are currently under
  * review.
  */


  /**
   * getOwnershipsForLandlord(landlord_id)
   * @param landlord_id: string => The id of the landlord to query ownership of
   *
   * @desc This query searches for all ownership documents that are owned by a landlord
   * with the given landlord_id
   */

   /**
    * getOwnershipConflicts
    * @desc Given the id to an ownership document, look through the collection of all ownership
    * documents and see if there area any conflicts with this ownership and other ownerships.
    * A conflict is represented where there are multiple ownership submissions for the same property.
    *
    * @param ownership_id: string => The id of the ownership document to check conflicts for
    */

    /**
     * createOwnershipReview (landlord_id, property_location)
     * @param landlord_id: string => The id for the landlord to assign ownership to
     * @param property_location: string => The address location to match ownership to
     *
     * @desc This mutation creates a new ownership document for the landlord
     * and puts the ownership status as "in-review". Based on the property location,
     * try to find a property that exists or is closest to this property.
     * If one is found, assign the property_id of the ownership document to
     * the property.
     */

     /**
      * createOwnershipReview(ownership_id, documents_info)
      * @param ownership_id: string => The ObjectId of the ownership document
      * to store the document information into.
      * @param documents_info: OwnershipDocumentInput => The list of document
      * informations that need to be added to the ownership document.
      *
      * @desc Adds the documents from documents_info to the ownership
      * document with the specified ownership_id.
      * Returns the updated ownership document
      */

      /**
  * addOwnershipConfirmationActivity()
  * @desc confirmation_activity => This is an array of messages sent by ownership_reviewers to update
  * the status of an ownership document that is in-review. This is so that any other ownership_reviewer
  * that looks at the in-review form can see what other reviewers have done, for example, if they have
  * already gotten in contact with the landlord or sent messages or approved that their documents are
  * real, etc.
  *
  * @param ownership_id => The id of the ownership document to add activity to
  * @param user_id => The id of the user that is updating the activity
  * @param user_type => The type of user that is interactinv with the activity (student / landlord)
  * @param message => The message describing the activity that it is being updated with
  * @param date_submitted => The ISO string date the activity update was submitted
  */

  /**
 * changeOwnershipStatus ()
 * @desc Change the status of an ownership documnet between
 * 'in-review', 'confirmed' or 'declined'
 *
 * @param ownership_id: string => The id of the ownership document to change the status of
 * @param new_status: string => The new status to set the document to
 */

 /**
  fillNamesForOwnershipMetadata
  * Given the ownership document, store the names for each entry in the confirmation_activity
  * and status_change_history within their corresponding documents.
  * @param ownership_
  */
