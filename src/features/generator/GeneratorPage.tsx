import React from 'react';
import { ContentTypeForm } from './ContentTypeForm';
import { CodePreview } from './CodePreview';
import { QrStylePicker } from './QrStylePicker';
import { TemplateManager } from './TemplateManager';

export const GeneratorPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <TemplateManager />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ContentTypeForm />
          <QrStylePicker />
        </div>

        <div>
          <CodePreview />
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;
