interface InputProps {
  placeholder: string;
  type: string;
}

export const Input = ({ placeholder, type }: InputProps) => {
  return <input placeholder={placeholder} type={type} />;
};
