'use client';

import React, { useEffect, useRef } from 'react';

import 'suneditor/dist/css/suneditor.min.css';

import dynamic from 'next/dynamic';

import { sunEditorOptions } from './suneditorConfig';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false, // Disable server-side rendering
});

// Định nghĩa props
interface SunEditorComponentProps {
  content?: string; // Có thể có hoặc không
  setContent?: (content: string) => void; // Có thể có hoặc không
  handleChange?: (content: string) => void;
  onBlur?: () => void; // Có thể có hoặc không
}

const SunEditorComponent: React.FC<SunEditorComponentProps> = ({
  content = '',
  setContent = () => {}, // Hàm mặc định tránh lỗi khi không truyền
  onBlur,
}) => {
  const editorRef = useRef<any>(null);

  // Đồng bộ nội dung khi content từ props thay đổi
  useEffect(() => {
    if (editorRef.current && editorRef.current.getContents && editorRef.current.getContents() !== content) {
      editorRef.current.setContents(content);
    }
  }, [content]);

  // Xử lý thay đổi nội dung
  const handleChange = (text: string) => {
    setContent(text);
  };

  // Xử lý khi editor mất focus (nếu có onBlur)
  const handleBlur = () => {
    if (onBlur && editorRef.current) {
      onBlur();
    }
  };

  return (
    <SunEditor
      getSunEditorInstance={(instance) => {
        editorRef.current = instance;
      }}
      name="content"
      defaultValue={content}
      onChange={handleChange}
      onBlur={handleBlur}
      setOptions={{
        ...sunEditorOptions,
        //   imageUploadUrl: `${BASE_API_URL}/upload/editor`,
        //   callBackSave: handleChange, // Xử lý khi lưu
        // Xử lý upload ảnh
      }}
      // onImageUploadBefore={handleImageUpload}
    />
  );
};

export default SunEditorComponent;
