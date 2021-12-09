const instantiateOptionsSchema = {
    "title": "Instantiate options",
    "description": "Instantiate options for a smart contract when deploying",
    "type": "object",
    "required": [],
    "properties": {
        "memo": {
            "type": "string",
            "title": "memo"
        },
        "transferAmount": {
            "type": "array",
            "title": "A list of token types to transfer to the contract",
            "items": [],
            "additionalItems": {
                "title": "Coin",
                "type": "object",
                "required": [
                    "amount", "denom"
                ],
                "properties": {
                    "amount": {
                        "title": "Amount",
                        "type": "string",
                        "default": "1"
                    },
                    "denom": {
                        "title": "Denom",
                        "type": "string",
                        "default": "orai"
                    }
                }
            }
        },
        "admin": {
            "type": "string",
            "title": "Contract admin",
            "default": ""
        }
    }
}

export default instantiateOptionsSchema;