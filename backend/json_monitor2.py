import json
import os
import time

import boto3
from dotenv import load_dotenv

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
REGION_NAME = 'us-east-2'

dynamodb = boto3.resource(
    'dynamodb',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=REGION_NAME
)

PRIMARY_KEYS = {
    'Organizations': ['Location'],
    'Events': ['Location'],
    'JobPostings': ['Location', 'DatePosted']
}

RELEVANT_FIELDS = {
    'Organizations': ['Location', 'Name', 'Description', 'Phone', 'Email', 'Website'],
    'Events': ['Location', 'Name', 'Description', 'Phone', 'Email', 'Website'],
    'JobPostings': ['Location', 'DatePosted', 'Title', 'CompanyName', 'Desc', 'Link']
}


def load_json_data(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)


def get_standardized_db_items(table_name, relevant_fields):
    table = dynamodb.Table(table_name)
    response = table.scan()
    items = response.get('Items', [])

    # Only keep relevant fields in each DynamoDB item
    standardized_items = [
        {k: v for k, v in item.items() if k in relevant_fields} for item in items]
    return standardized_items

# Standardize JSON data by filtering only the relevant fields, including nested fields


def standardize_json_data(json_data, relevant_fields, table_name):
    standardized_data = []
    for item in json_data:
        if table_name == 'Organizations' or table_name =='Events':
            standardized_item = {
                'Location': item.get('location'),
                'Name': item.get('name'),
                'Description': item.get('description'),
                'Phone': item.get('contact', {}).get('phone'),
                'Email': item.get('contact', {}).get('email'),
                'Website': item.get('contact', {}).get('website')
            }
        elif table_name == 'JobPostings':
            standardized_item = {
                'Location': item.get('companyLocation'),
                'DatePosted': item.get('jobPosting'),
                'Title': item.get('jobTitle'),
                'CompanyName': item.get('companyName'),
                'Desc': ' '.join(item.get('jobDescription', [])),
                'Link': item.get('jobLink')
            }

        else:
            standardized_item = {}

        # Filter the item to contain only relevant fields
        standardized_data.append(
            {k: v for k, v in standardized_item.items() if k in relevant_fields})
    return standardized_data

# Convert item to tuple for easy comparison


def item_to_tuple(item, keys):
    return tuple(item[key] for key in keys if key in item)

# Compare JSON items to DynamoDB items, returning only new ones


def find_new_items(json_data, db_items, primary_keys):
    db_items_set = {item_to_tuple(item, primary_keys) for item in db_items}
    return [item for item in json_data if item_to_tuple(item, primary_keys) not in db_items_set]

# Insert new items into DynamoDB


def insert_new_items(table_name, new_items):
    table = dynamodb.Table(table_name)
    for item in new_items:
        try:
            table.put_item(Item=item)
            print(f"Inserted new item: {item}")
        except Exception as e:
            print(f"Failed to insert item: {item}, Error: {e}")


def run_monitor():
    while True:
        main('Organizations')  # Change this argument to test with other tables
        main('JobPostings')  # Change this argument to test with other tables
        main('Events')  # Change this argument to test with other tables
        time.sleep(200)  # change this during testing
# Main function to load, compare, and insert new items


def main(table_name):
    json_file_path = os.path.join('..', f'{table_name.lower()}_results.json')
    primary_keys = PRIMARY_KEYS.get(table_name, [])
    relevant_fields = RELEVANT_FIELDS.get(table_name, [])

    # Load JSON data and standardize to relevant fields
    json_data = load_json_data(json_file_path)
    json_data = standardize_json_data(json_data, relevant_fields, table_name)

    # Retrieve and standardize existing items from DynamoDB
    db_items = get_standardized_db_items(table_name, relevant_fields)

    # Find new items that don't exist in DynamoDB
    new_items = find_new_items(json_data, db_items, primary_keys)

    # Insert only new items
    if new_items:
        insert_new_items(table_name, new_items)
    else:
        print("No new items to insert.")


# Run the main function
if __name__ == '__main__':
    run_monitor()
