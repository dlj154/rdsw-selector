import { PlayfulCategory, PlayfulCategoryId } from '@/types';

export const CATEGORIES: PlayfulCategory[] = [
  {
    id: 'main-stage',
    label: 'Main Stage',
    emoji: '🎤',
    description: 'Keynotes & fireside chats',
    badgeClass: 'bg-badge-keynotes',
    badgeTextClass: 'text-badge-keynotes-text',
  },
  {
    id: 'build-cool-stuff',
    label: 'Build Cool Stuff',
    emoji: '🛠️',
    description: 'Product, engineering, AI',
    badgeClass: 'bg-badge-product',
    badgeTextClass: 'text-badge-product-text',
  },
  {
    id: 'big-brain-energy',
    label: 'Big Brain Energy',
    emoji: '🧠',
    description: 'Strategy & vision',
    badgeClass: 'bg-badge-strategy',
    badgeTextClass: 'text-badge-strategy-text',
  },
  {
    id: 'cha-ching',
    label: 'Cha-Ching',
    emoji: '💰',
    description: 'Revenue, sales, growth',
    badgeClass: 'bg-badge-revenue',
    badgeTextClass: 'text-badge-revenue-text',
  },
  {
    id: 'squad-goals',
    label: 'Squad Goals',
    emoji: '🤝',
    description: 'Networking & community',
    badgeClass: 'bg-badge-networking',
    badgeTextClass: 'text-badge-networking-text',
  },
  {
    id: 'wildcard',
    label: 'Wildcard',
    emoji: '🃏',
    description: 'Partner events & more',
    badgeClass: 'bg-badge-partner',
    badgeTextClass: 'text-badge-partner-text',
  },
];

const TAG_TO_CATEGORY: Record<string, PlayfulCategoryId> = {
  'Keynotes': 'main-stage',
  'Product': 'build-cool-stuff',
  'Strategy': 'big-brain-energy',
  'Revenue': 'cha-ching',
  'Networking': 'squad-goals',
  'Partner Event': 'wildcard',
};

export function getCategoryById(id: PlayfulCategoryId): PlayfulCategory {
  return CATEGORIES.find(c => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}

export function categorizeEvent(tags: string[]): PlayfulCategory {
  const meaningfulTags = tags.filter(t => t !== 'RDSW26');

  for (const tag of meaningfulTags) {
    const categoryId = TAG_TO_CATEGORY[tag];
    if (categoryId) {
      return getCategoryById(categoryId);
    }
  }

  return getCategoryById('wildcard');
}
