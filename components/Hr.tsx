import { Box, BoxProps, color } from '@stacks/ui';

export function Hr(props: BoxProps) {
  return <Box height="1px" width="100%" backgroundColor={color('border')} {...props} />;
}
