import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { getFaqsByAdvertimentId } from "@/redux/thunks/faq";

export default function FAQs({ advertisementId }: { advertisementId: number }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const faqs = useSelector((state: RootState) => state.faq.faqs);
  
  useEffect(() => {
    dispatch(getFaqsByAdvertimentId(advertisementId));
  }, [advertisementId]);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto p-2 md:p-4">
      <h2 className="text-lg md:text-xl font-bold text-green-600 mb-4">
        Câu hỏi thường gặp
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border p-4 rounded-md">
            <button
              onClick={() => handleToggle(index)}
              className="text-left w-full font-semibold hover:text-primary-color"
            >
              {faq.question}
            </button>
            {activeIndex === index && (
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
