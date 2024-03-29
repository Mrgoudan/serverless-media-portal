import bcrypt from "bcryptjs";

export default (name, password) => {
	const sanitizedName = name
		.toLowerCase()
		.replace(/\W/g, "");
	const salt = "$2a$10$yGsdhh0HUIWMoECia9IcLe";
	const stringToHash = `${sanitizedName}/${password}`;
	const hash = bcrypt.hashSync(stringToHash, salt);

	return hash;
};
