<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Write your article content here...'
  }
});

const emit = defineEmits(['update:modelValue']);

const editorRef = ref<Quill | null>(null);
const editorElement = ref<HTMLElement | null>(null);

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, false] }],
  ['bold', 'italic', 'underline'],
  ['blockquote'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean']
];

onMounted(() => {
  if (!editorElement.value) return;

  editorRef.value = new Quill(editorElement.value, {
    theme: 'snow',
    placeholder: props.placeholder,
    modules: {
      toolbar: TOOLBAR_OPTIONS
    }
  });

  // Set initial content
  if (props.modelValue) {
    editorRef.value.root.innerHTML = props.modelValue;
  }

  // Handle content changes
  editorRef.value.on('text-change', () => {
    const content = editorRef.value?.root.innerHTML;
    emit('update:modelValue', content === '<p><br></p>' ? '' : content);
  });
});

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (editorRef.value && newValue !== editorRef.value.root.innerHTML) {
    editorRef.value.root.innerHTML = newValue;
  }
});
</script>

<template>
  <div class="article-editor">
    <div ref="editorElement" class="editor-content" />
  </div>
</template>

<style>
.article-editor {
  border-radius: 8px;
  overflow: hidden;
}

.article-editor .ql-toolbar.ql-snow {
  border: 1px solid #ced4da;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: #f8f9fa;
  padding: 8px;
}

.article-editor .ql-container.ql-snow {
  border: 1px solid #ced4da;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  min-height: 320px;
  font-family: inherit;
}

.article-editor .ql-editor {
  min-height: 320px;
  font-size: 1.1rem;
  line-height: 1.6;
  padding: 1rem;
}

.article-editor .ql-editor p {
  margin-bottom: 1rem;
}

.article-editor .ql-editor.ql-blank::before {
  font-style: normal;
  color: #666;
}

.article-editor .ql-snow .ql-toolbar button:hover,
.article-editor .ql-snow .ql-toolbar button.ql-active {
  color: #6a0dad;
}

.article-editor .ql-snow .ql-toolbar button:hover .ql-stroke,
.article-editor .ql-snow .ql-toolbar button.ql-active .ql-stroke {
  stroke: #6a0dad;
}

.article-editor .ql-snow .ql-toolbar button:hover .ql-fill,
.article-editor .ql-snow .ql-toolbar button.ql-active .ql-fill {
  fill: #6a0dad;
}
</style> 