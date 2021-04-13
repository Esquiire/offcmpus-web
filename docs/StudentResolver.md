StudentResolver
/**
 * getStudent (_id: mongoose.Types.ObjectId)
 * @desc Look for and return the student with the given id. If no student with that
 *        id exists, return an error.
 *
 * @param _id: mongoose.Types.ObjectId => The id of the student to retrieve
*/

/**
 * getStudentSavedCollection(_id, {offset, count}: CollectionFetchInput)
 * @desc This function returns the user's collection of properties that they have saved.
 *
 * @param _id The id of the student to get the collection for
 * @param collectionOptions
 *          offset: number => The amount to offset the fetch by
 *          count: number => The max amount of documents to return
 */


 /**

getStudentNotifications
 * @desc get the notifications for the student with the
 * specified student_id
 * @param student_id The student to get the notificaions for
 */


 /**
 studentAccessShouldBeRestricted
 * @desc Determine whether or not to restrict the access of a student.
 * If the student has not confirmed their institution email within 24 hours, they
 * should be restricted from using the app.
 * @param context
 */


 /**
 * updateStudentSearchStatus
 * @desc Update the status for the student with the id.
 * @param id The id for the student to update the status for.
 * @param searching Specify whether the student is looking for a property or not
 * @param search_start Set the start date the student is looking for, if looking is set to true
 * @param search_end Set the end date the student is looking for, if looking is set to true
 */

 /**
 * addPropertyToStudentCollection(student_id: string, property_id: string)
 * @desc Add a property with the specified property_id to the student's collection.
 *
 * @param student_id: string => The student's id of the collection to add the property to
 * @param property_id: string => The id of the property to add to the student's collection
 */
 /**
 * removePropertyFromStudentCollection(student_id: string, property_id: string)
 * @desc Add a property with the specified property_id to the student's collection.
 *
 * @param student_id: string => The student's id of the collection to add the property to
 * @param property_id: string => The id of the property to add to the student's collection
 */

 /**
 * updateStudent ()
 * @desc Update the student information for the student with the provided id.
 *        If a parameter field is null, that field should be left unmodified.
 *
 * @param _id: mongoose.Types.ObjectId => The id of the student to update
 * @param new_student
 *          first_name: string | null => The new value of the first_name for the student
 *          last_name: string | null => The new value of the last_name for the student
 *          email: string | null => The new value of the email for the student
 */
