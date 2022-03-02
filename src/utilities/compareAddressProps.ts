import { ReactivePartComponentProps } from 'types/Parts';

const compareAddressProps = (
  prevProps: ReactivePartComponentProps,
  nextProps: ReactivePartComponentProps,
) =>
  prevProps.address[prevProps.address.length - 1] ===
  nextProps.address[nextProps.address.length - 1];
export default compareAddressProps;
