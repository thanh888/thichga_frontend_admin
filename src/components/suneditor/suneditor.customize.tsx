'use client';

import React, { useEffect, useRef } from 'react';
import SunEditor from 'suneditor-react';

import 'suneditor/dist/css/suneditor.min.css';

import { sunEditorOptions } from './suneditorConfig';

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
  const editorRef = useRef<typeof SunEditor>(null);

  // Đồng bộ nội dung khi content từ props thay đổi
  useEffect(() => {
    if (editorRef.current?.editor.getContents() !== content && editorRef.current) {
      editorRef.current.editor.setContents(content);
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
    <div>
      <SunEditor
        ref={editorRef}
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
    </div>
  );
};

export default SunEditorComponent;
