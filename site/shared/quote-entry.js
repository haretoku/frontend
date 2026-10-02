import './styles/fixed-quote-bar.css';
import { mountFixedQuoteBar, QUOTE_ACTION } from './fixed-quote-bar.js';

const article = document.querySelector('article.article--guide');
mountFixedQuoteBar({ action: { ...QUOTE_ACTION, description: article?.dataset.quoteDescription || '自宅の導入費用を，見積もりで確認しましょう．' } });
