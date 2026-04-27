import type * as React from "react";
import { Text, type TextProps } from "react-native";
import Svg, { Text as SvgText } from "react-native-svg";
import { RIYAL_SYMBOL_TEXT } from "../constants";
import { type FormatRiyalOptions, formatRiyal } from "../format";

export type RiyalSymbolProps = TextProps & {
	size?: number;
	color?: string;
};

/** Saudi Riyal symbol rendered as React Native `<Text>`. */
export const RiyalSymbol: React.FC<RiyalSymbolProps> = ({ size = 16, color, style, ...rest }) => {
	return (
		<Text
			accessibilityLabel="Saudi Riyal"
			style={[{ fontSize: size, color, fontFamily: "Riyal" }, style]}
			{...rest}
		>
			{RIYAL_SYMBOL_TEXT}
		</Text>
	);
};

export type RiyalIconProps = {
	size?: number;
	color?: string;
};

/** SVG icon variant — works with `react-native-svg`. */
export const RiyalIcon: React.FC<RiyalIconProps> = ({ size = 24, color = "#000" }) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24">
			<SvgText x="12" y="18" textAnchor="middle" fontSize="20" fontFamily="Riyal" fill={color}>
				{RIYAL_SYMBOL_TEXT}
			</SvgText>
		</Svg>
	);
};

export type RiyalPriceProps = TextProps &
	FormatRiyalOptions & {
		amount: number;
	};

/** Pre-formatted Riyal price for React Native. */
export const RiyalPrice: React.FC<RiyalPriceProps> = ({
	amount,
	locale,
	decimals,
	useCode,
	notation,
	currency,
	style,
	...rest
}) => {
	const text = formatRiyal(amount, { locale, decimals, useCode, notation, currency });
	return (
		<Text style={[{ fontFamily: "Riyal" }, style]} {...rest}>
			{text}
		</Text>
	);
};
