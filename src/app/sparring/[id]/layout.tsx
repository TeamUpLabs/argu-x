import DefaultHeader from "@/components/common/DefaultHeader";

export default function SparringLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DefaultHeader fixed />
      {children}
    </>
  );
}