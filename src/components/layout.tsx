const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full md:max-w-5xl mx-auto py-10 px-4">{children}</div>
  );
};

export default Layout;
