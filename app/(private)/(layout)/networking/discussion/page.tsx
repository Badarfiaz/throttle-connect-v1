"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Image as ImageIcon,
  X,
  MessageSquare,
  Users,
  Info,
  AlertCircle,
  Clock,
  ChevronRight,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/app/redux/hooks";
import { auth, db, storage } from "@/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import Link from "next/link";

interface Message {
  id: string;
  text: string;
  imageUrl?: string;
  senderUid: string;
  senderName: string;
  senderEmail: string;
  createdAt: any;
}

const CHANNEL_RULES = [
  "Be respectful to all community members.",
  "Keep discussions related to cars, bikes, parts, and services.",
  "No spamming, advertising, or self-promotion in this channel.",
  "Avoid posting offensive or inappropriate media.",
];

export default function DiscussionPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);

  // Subscribe to real-time messages from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "networkingDiscussion"),
      orderBy("createdAt", "asc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMessages: Message[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedMessages.push({
            id: doc.id,
            text: data.text || "",
            imageUrl: data.imageUrl,
            senderUid: data.senderUid || "",
            senderName: data.senderName || "Enthusiast",
            senderEmail: data.senderEmail || "",
            createdAt: data.createdAt,
          });
        });
        setMessages(fetchedMessages);
        setLoading(false);
        
        // Scroll to bottom only on the very first load
        if (!hasInitialScrolled) {
          setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setHasInitialScrolled(true);
          }, 100);
        }
      },
      (err) => {
        console.error("Error listening to discussion:", err);
        toast.error("Failed to load messages.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hasInitialScrolled]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large", { description: "Maximum image size is 5MB." });
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Sign-in required", { description: "Please log in to send messages." });
      return;
    }

    if (!inputText.trim() && !selectedImage) return;

    const textToSend = inputText.trim();
    setInputText(""); // Clear input early for responsive feel
    const imageToUpload = selectedImage;
    handleRemoveImage(); // Clear preview

    try {
      let imageUrl = "";

      if (imageToUpload) {
        setUploadProgress(10);
        const storageRef = ref(storage, `discussion_photos/${Date.now()}_${imageToUpload.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageToUpload);

        // Wait for upload to complete
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setUploadProgress(prog);
            },
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                imageUrl = downloadURL;
                resolve();
              });
            }
          );
        });
      }

      // Add document to Firestore
      await addDoc(collection(db, "networkingDiscussion"), {
        text: textToSend,
        imageUrl: imageUrl || null,
        senderUid: user.userId,
        senderName: user.name || user.email.split("@")[0] || "Enthusiast",
        senderEmail: user.email,
        createdAt: serverTimestamp(),
      });

      // Scroll to bottom when the current user sends a message
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (err: any) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message", { description: err.message });
    } finally {
      setUploadProgress(null);
    }
  };

  // Get sender initials for avatar
  const getInitials = (name: string) => {
    return name ? name.trim().charAt(0).toUpperCase() : "?";
  };

  // Format timestamp helper
  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-73px)] bg-[#f8fafc] overflow-hidden">
      {/* Sidebar Info Section (Desktop) */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-200 bg-white p-6 flex flex-col justify-between shrink-0 overflow-y-auto md:h-full">
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#19376D]/10 text-[#19376D] text-xs font-semibold mb-3">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Broadcast Channel</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#0B2447]">Global Discussion</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Ask questions, share photos of your rides, find recommendations for parts or services, and chat with other members.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Guidelines */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-450 text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-400" />
              Channel Rules
            </h3>
            <ul className="space-y-2">
              {CHANNEL_RULES.map((rule, idx) => (
                <li key={idx} className="flex gap-2 text-xs text-slate-600 leading-normal items-start">
                  <span className="text-[#19376D] font-bold shrink-0 mt-0.5">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Channel Stats */}
        <div className="mt-8 pt-4 border-t border-slate-100 space-y-3 hidden md:block">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              Members Active
            </span>
            <span className="font-bold text-slate-700">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-slate-600">Open Community Room</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B2447] to-[#19376D] text-white flex items-center justify-center font-black shadow-md shadow-blue-500/10">
              #
            </div>
            <div>
              <h1 className="font-bold text-[#0B2447] text-base leading-none">global-lobby</h1>
              <p className="text-xs text-slate-500 mt-1">Car &amp; Bike enthusiasts open chat board</p>
            </div>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="h-full flex items-center justify-center flex-col gap-2">
              <span className="animate-spin w-6 h-6 border-2 border-[#19376D] border-t-transparent rounded-full" />
              <p className="text-xs text-slate-400 font-medium">Loading channel history...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex items-center justify-center flex-col text-center p-6 space-y-3">
              <div className="p-4 bg-[#19376D]/5 text-[#19376D] rounded-full">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800">No messages yet</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Be the first one to start the conversation! Ask a question or share a photo of your ride.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderUid === user?.userId;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${
                    isMe ? "ml-auto flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm text-white ${
                    isMe ? "bg-[#19376D]" : "bg-[#0F4C75]"
                  }`}>
                    {getInitials(msg.senderName)}
                  </div>

                  {/* Message Content */}
                  <div className="space-y-1">
                    {/* Name & Time */}
                    <div className={`flex items-baseline gap-2 text-[11px] ${isMe ? "justify-end" : ""}`}>
                      <span className="font-bold text-slate-800">{msg.senderName}</span>
                      <span className="text-slate-400 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>

                    {/* Bubble */}
                    <div className={`p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      isMe
                        ? "bg-[#19376D] text-white rounded-tr-none"
                        : "bg-white text-slate-800 border border-slate-200/60 rounded-tl-none"
                    }`}>
                      {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                      
                      {msg.imageUrl && (
                        <div className={`mt-2.5 rounded-xl overflow-hidden border ${isMe ? 'border-white/10' : 'border-slate-100'} max-w-sm`}>
                          <img
                            src={msg.imageUrl}
                            alt="Uploaded attachment"
                            className="w-full h-auto max-h-64 object-cover hover:opacity-95 transition cursor-pointer"
                            onClick={() => window.open(msg.imageUrl, '_blank')}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Upload Progress Bar */}
        {uploadProgress !== null && (
          <div className="absolute bottom-[80px] left-6 right-6 bg-white border border-slate-200 rounded-xl p-3 shadow-md flex items-center gap-3 z-10">
            <span className="animate-spin w-4 h-4 border-2 border-[#19376D] border-t-transparent rounded-full shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Uploading ride image...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#19376D] rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Chat Input Section */}
        <div className="bg-white border-t border-slate-200 p-4 shadow-md shrink-0">
          {user ? (
            <form onSubmit={handleSendMessage} className="space-y-3">
              {/* Image Preview Row */}
              <AnimatePresence>
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl max-w-xs relative group"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-300/50 bg-white shrink-0">
                      <img src={imagePreview} alt="Upload preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">{selectedImage?.name}</p>
                      <p className="text-[10px] text-slate-400">Ready to upload</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-1.5 -right-1.5 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-sm transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2">
                {/* File Attachment Button */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-11 w-11 rounded-xl border-slate-200 hover:border-[#19376D] hover:bg-blue-50/25 shrink-0 cursor-pointer"
                >
                  <ImageIcon className="w-5 h-5 text-slate-500 hover:text-[#19376D]" />
                </Button>

                {/* Text Input */}
                <Input
                  type="text"
                  placeholder="Type a message, ask a question, or share a photo..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 h-11 border-slate-200 focus-visible:ring-[#19376D] focus:border-[#19376D] rounded-xl text-sm"
                />

                {/* Send Button */}
                <Button
                  type="submit"
                  disabled={!inputText.trim() && !selectedImage}
                  className="h-11 px-5 rounded-xl bg-[#19376D] hover:bg-[#0B3A5B] text-white font-bold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2.5 text-slate-500">
                <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">
                  Please log in or register to join the discussion and share your thoughts.
                </span>
              </div>
              {/* Note: In this environment, the login modal can be triggered by clicking Login in the header. We can provide a link to the login page or a notification. */}
              <p className="text-xs font-bold text-[#19376D] bg-[#19376D]/10 px-3 py-1.5 rounded-lg shrink-0">
                Sign In from the Header
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
