#!/bin/bash

# Load the contact IDs from the contacts.json file
contact_ids=$(jq -r '.ContactIdentifiers[]' contacts.json)

# Update volunteer points for a contact
update_volunteer_points() {
  local contact_id=$1
  local access_token=$2
  
  # Prepare the data to update the Volunteer Points field to 0
  update_data=$(jq -n --argjson value 0 --arg id "$contact_id" '{
    "FieldValues": [
      {
        "FieldName": "Volunteer Points",
        "Value": $value
      }
    ],
    "Id": $id
  }')
  
  # Make the API request to update the contact
  curl -X 'PUT' \
    'https://api.wildapricot.org/v2.3/accounts/40428/eventregistrations' \
    -H 'accept: application/json' \
    -H "Authorization: Bearer mYLKuvPUWozL4Vg4Tk2WCilRjVk-" \
    -H 'Content-Type: application/json' \
    -d '{
  "Event": {
    "Id": 5842936
  },
  "Contact": {
    "Id": 75255008
  },
  "RegistrationTypeId": 9326765,
  "GuestRegistrationsSummary": {
    "NumberOfGuests": 0,
    "NumberOfGuestsCheckedIn": 0,
    "GuestRegistrations": []
  },
  "IsCheckedIn": false,
  "RegistrationFields": [
    {
      "FieldName": "First name",
      "Value": "Michelle",
      "SystemCode": "FirstName"
    },
    {
      "FieldName": "Last name",
      "Value": "Wang",
      "SystemCode": "LastName"
    },
    {
      "FieldName": "e-Mail",
      "Value": "wang.mick12@outlook.com",
      "SystemCode": "Email"
    },
    {
      "FieldName": "Phone",
      "Value": "647-471-2966",
      "SystemCode": "Phone"
    },
    {
      "FieldName": "Waiver",
      "Value": true,  
      "SystemCode": "custom-14890495"
    }
  ],
  "ShowToPublic": false
}'
  curl -s -X PUT \
    "https://api.wildapricot.org/v2.3/accounts/40428/contacts/${contact_id}" \
    -H "Authorization: Bearer ${access_token}" \
    -H "Content-Type: application/json" \
    -d "$update_data"
}

# Main execution
access_token="x4rO9rtjXxPLUMQZi9ATI-QUub4-"

for contact_id in $contact_ids; do
  update_volunteer_points "$contact_id" "$access_token"
  echo "Updated Volunteer Points to 0 for contact ID: $contact_id"
done
