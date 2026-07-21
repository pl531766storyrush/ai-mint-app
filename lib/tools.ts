import { ToolDef } from '@/types';

export const TOOLS: ToolDef[] = [
  {
    key: 'chat',
    title: 'AI Chat',
    description: 'Converse with an intelligent assistant',
    icon: 'MessageCircle',
    route: '/chat',
    accent: '#22C55E',
  },
  {
    key: 'image',
    title: 'Image Generator',
    description: 'Create stunning images from text',
    icon: 'Image',
    route: '/image',
    accent: '#10B981',
  },
  {
    key: 'video',
    title: 'Video Generator',
    description: 'Generate short video clips',
    icon: 'Video',
    route: '/video',
    accent: '#34D399',
  },
  {
    key: 'voice',
    title: 'Voice Generator',
    description: 'Turn text into natural speech',
    icon: 'AudioLines',
    route: '/voice',
    accent: '#22C55E',
  },
  {
    key: 'writer',
    title: 'AI Writer',
    description: 'Draft articles, emails & more',
    icon: 'PenLine',
    route: '/writer',
    accent: '#10B981',
  },
  {
    key: 'search',
    title: 'Web Search',
    description: 'Ask the web and get answers',
    icon: 'Globe',
    route: '/search',
    accent: '#4ADE80',
  },
];

export function getTool(key: string): ToolDef | undefined {
  return TOOLS.find((t) => t.key === key);
}
