const Dynamo = require("../../persistence/storage/DynamoDb");

module.exports = async () => {
	await new Dynamo().AddItemToTable(
		process.env.userTableName,
		{
			UserHash: "$2a$10$yGsdhh0HUIWMoECia9IcLeS0C.n.R86wAl6RHUGqt/lEhv8vjakP.",
			DisplayName: "admin",
			Tags: ["Admin"]
		}
	);
};
