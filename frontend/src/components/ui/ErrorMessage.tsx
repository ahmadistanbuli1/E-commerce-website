interface IProps {
  msg?: string;
}

const ErrorMessage = ({ msg }: IProps) => {
  if (!msg) return null;
  return <p className="mt-1 text-sm text-red-600">{msg}</p>;
};

export default ErrorMessage;
