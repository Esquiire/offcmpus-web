/**
   checkEligibleForLeaseAgreement
   * @desc Determine whether the student with the
   * given student_id can view the lease agreement for
   * the given lease.
   *
   * The lease must be on market (active) for it to be viewed.
   *
   * @param lease_id The id of the lease to check
   * @param student_id The student who to check for eligibility
   */
/**
    getRoomNo
    * @desc Given the lease_id, return the room number that the
    * of the lease for the property.
    * @param ownership_id The ownership that corresponds to the property to get
    * the room numbers of
    * @param lease_id The lease to get the room number of
        */


   /**
   getLeasesAndOccupants
   * Given an id to a ownership document, find all leases that correspond
   * to this document and their occupant student documents, if they are not null.
   * @param ownership_id The id of the ownership document to get the leases for
   */


   /**
   getAcceptedLeaseInfo
    * Find the information about the lease accepted by the student
    * for a particular property & room.
    */


    /**
    getLeaseSummary
     * @desc Get the summary for the lease with the given lease
     * id.
     * @param property_id
     * @param lease_id
     */

     /**
     canAddReview
      * @desc Determine whether or not the student can add a review to the
      * property with the given id.
      *
      * @param student_id The id of the student
      * @param property_id The id of the property
      *
      * If they can add a review, within the data, set the digit for the api response as:
      *  1 -> if they have an existing review for this property
      *  2 -> if they do not have a review on record for this property
      */

      /**
      addLeaseHistory
        * @desc TEMPORARY RESOLVER: This resolver is only meant to test the
        * review system, which only allows students who have previously leased
        * a property to add a review.
        * @param student_id
        * @param start_date
        * @param end_date
        */

    /**
     * expressInterest
     * @desc A student expresses interest in a lease. They can
     * express interest in as many leases as long as they do not
     * conflict with one they are currently leasing out
     * (if it's on record)
     * @param student_id The student who is expressing interest
     * @param lease_id The lease they are expressing interest in
     */


     /**
     addLandlordResponseToReview
       * @desc Allow a landlord to response to a property review
       * put on their property from a previous leaser.


       /**
      updateUnoccupiedLeases
        * @desc Update multiple lease documents that are for a specific ownership document. This mutator
        * strictly modified unoccupied leases.
        * @param ownership_id The id of the ownership document that these leases belong to
        * @param leases_info An array of LeaseUpdateInput that describes the changes to be made to their respective
        * lease documents.
        *
        * @returns All lease documents modified by this mutation's instance will be returned.
        */
