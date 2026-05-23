import type { Metadata } from "next";
import ChatInterface from "@/components/chat/ChatInterface";

export const metadata: Metadata = {
  title: "Chat - BOBA AGENT",
  description: "Chat with your AI assistant",
};

export default function ChatPage() {
  return <ChatInterface />;
}
