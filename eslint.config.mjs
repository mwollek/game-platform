import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	eslintConfigPrettier,
	{
		files: ["src/app/api/**/*.ts"],
		rules: {
			"@typescript-eslint/explicit-module-boundary-types": "error",
		},
	},
];

export default eslintConfig;
