import { Hr } from "./Hr";
import {
  Box,
  BoxProps,
  Flex,
  FlexProps,
  Stack,
  StackProps,
  Text,
  color,
} from "@stacks/ui";
import React, { FC, cloneElement, isValidElement } from "react";

export function InfoCard(props: FlexProps) {
  return (
    <Flex
      flexDirection="column"
      boxShadow="low"
      border={`1px solid ${color("border")}`}
      borderRadius="8px"
      minHeight="84px"
      {...props}
    />
  );
}

type ChildProps = BoxProps;

type TChild = string | React.ReactElement<ChildProps>;

interface Props extends BoxProps {
  children: TChild | TChild[];
}
export const InfoCardGroup = ({ children, ...props }: Props) => {
  const parsedChildren = Array.isArray(children) ? children : [children];
  const infoGroup = parsedChildren.flatMap((child, index) => {
    if (!isValidElement(child)) return null;
    return [
      cloneElement(child, {
        key: index,
        mb: index === parsedChildren.length ? "280px" : undefined,
      }),
      index !== parsedChildren.length - 1 && (
        <Hr my="loose" key={index.toString() + "-hr"} />
      ),
    ];
  });
  return <Box {...props}>{infoGroup}</Box>;
};

export const InfoCardSection: FC<StackProps> = ({ children, ...props }) => (
  <Stack {...props} spacing="base-tight">
    {children}
  </Stack>
);

export const InfoCardRow: FC<FlexProps> = (props) => (
  <Flex justifyContent="space-between" {...props} />
);

interface InfoCardLabelProps extends FlexProps {
  explainer?: string;
}
export const InfoCardLabel: FC<InfoCardLabelProps> = ({
  children,
  ...props
}) => (
  <Flex color={color("text-caption")} alignItems="center" {...props}>
    <Box mr={props.explainer ? "tight" : undefined}>{children}</Box>
  </Flex>
);

export const InfoCardValue: FC<FlexProps> = (props) => (
  <Text textStyle="body.large.medium" textAlign="right" {...props} />
);
