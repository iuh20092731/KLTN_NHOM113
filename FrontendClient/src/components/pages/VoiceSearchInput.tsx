import { useToast } from "@/hooks/use-toast";
import { Mic } from "lucide-react";
import React, { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL_CHATBOT;

interface VoiceSearchInputProps {
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement> | { target: { value: string } }
  ) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  isChat?: boolean;
}

interface TranscriptionResponse {
  success: boolean;
  data?: string;
  error?: string;
}

const VoiceSearchInput: React.FC<VoiceSearchInputProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  className,
  isChat = false,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mp4" });
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.m4a");

        try {
          const response = await fetch(`${BASE_URL}/api/transcribe`, {
            method: "POST",
            body: formData,
          });

          const result: TranscriptionResponse = await response.json();

          if (result.success && result.data) {
            const formattedText = result.data;
            if (isChat) {
              onChange({ target: { value: `recording.m4a:${formattedText}` } });
            } else {
              onChange({ target: { value: formattedText } });
            }
          } else {
            toast({
              variant: "destructive",
              title: "Lỗi",
              description:
                result.error ||
                "Không thể nhận dạng giọng nói. Vui lòng thử lại.",
            });
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
          });
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          "Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.",
      });
    }
  };

  const stopRecording = (): void => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`w-full pr-10 outline-none ${
          isChat
            ? "bg-white text-black"
            : "h-11 px-4 py-3 bg-white rounded-full text-black"
        }`}
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-2 rounded-full transition-all ${
            isRecording
              ? "text-red-500"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
          title={isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
          type="button"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default VoiceSearchInput;
