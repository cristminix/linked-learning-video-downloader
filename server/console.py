# import session

# buffer = session.query('39fb5c08164b09f7593ceb3c866fc9a9')
# print(buffer)


JSON_STORE_PATH = "storage/session.test.json"

def get_json_store():
	json_store_data = {}
	if os.path.exists(JSON_STORE_PATH):
        with open(JSON_STORE_PATH) as json_file:
            json_store_data = json.load(json_file)
            print('Loading json_db', len(SESSION))
    else:
        print('WARNING : file %s doesnt exists' %(JSON_STORE_PATH))
	
	return json_store_data

def update_json_store(json_store_data):
	pass
def main():
	pass


if __name__ == "__main__":
	main()