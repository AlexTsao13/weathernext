import Layout from "@/components/layout";
import Content from "@/modules/home/content";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Layout>
        <Content />
      </Layout>
    </div>
  );
}
