import { ActivityIndicator, View } from "react-native";
type Props = {
  children: React.ReactNode;
  loading: boolean;
};

export default function UserInfoCardContainer({ children, loading }: Props) {
  return loading ? (
    <ActivityIndicator
      size="large"
      color="#0000ff"
      className="mt-10 self-center"
    />
  ) : (
    <View>{children}</View>
  );
}
