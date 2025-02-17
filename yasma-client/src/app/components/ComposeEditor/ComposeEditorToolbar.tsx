'use client'
import styles from './Toolbar.module.css';
import React, {useCallback, useState} from 'react';
import classNames from 'classnames';
import { useInView } from 'react-cool-inview';
import { ToolbarProps } from '@/types/composer';
import {
    RiDoubleQuotesL,
    RiSeparator,
    RiTextWrap,
    RiFormatClear,
    RiArrowGoBackLine,
    RiArrowGoForwardLine,
} from 'react-icons/ri'

import { BoldButton } from '@/app/components/ComposeEditor/Controls/BoldButton';
import { ItalicButton } from '@/app/components/ComposeEditor/Controls/ItalicButton';
import { StrikeButton } from '@/app/components/ComposeEditor/Controls/StrikeButton';
import { CodeButton } from '@/app/components/ComposeEditor/Controls/CodeButton';
import { HeadingButton } from '@/app/components/ComposeEditor/Controls/HeadingButton';
import { ParagraphButton } from '@/app/components/ComposeEditor/Controls/ParagraphButton';
import { ListOrderedButton } from '@/app/components/ComposeEditor/Controls/ListOrderedButton';
import { ListBulletButton } from '@/app/components/ComposeEditor/Controls/ListBulletButton';
import { LinkButton } from '@/app/components/ComposeEditor/Controls/LinkButton';
import { UnlinkButton } from '@/app/components/ComposeEditor/Controls/UnlinkButton';
import { BlockQuoteButton } from '@/app/components/ComposeEditor/Controls/BlockQuoteButton';
import { HorizontalRuleButton } from '@/app/components/ComposeEditor/Controls/HorizontalRuleButton';
import { WrapTextButton } from '@/app/components/ComposeEditor/Controls/WrapTextButton';
import { UndoButton } from '@/app/components/ComposeEditor/Controls/UndoButton';
import { RedoButton } from '@/app/components/ComposeEditor/Controls/RedoButton';


export function ComposeEditorToolbar({ editor } : ToolbarProps) {
    const isCursorOverLink = editor.getAttributes('link').href

    const { observe, inView } = useInView({
        rootMargin: '-1px 0px 0px 0px',
        threshold: [1],
    })

  return (
      <div className={`${styles.ToolbarContainer} ${!inView ? "styles.sticky" : ""} flex-none`} ref={observe}>
          <div className="flex justify-center align-center">
              <BoldButton editor={editor}/>
              <ItalicButton editor={editor}/>
              <StrikeButton editor={editor}/>
              <CodeButton editor={editor}/>
              <HeadingButton editor={editor}/>
              <ParagraphButton editor={editor}/>
              <ListOrderedButton editor={editor}/>
              <ListBulletButton editor={editor}/>
              <div className="divider"></div>
              <LinkButton editor={editor}/>
              <UnlinkButton editor={editor}/>
              <div className="divider"></div>
              <BlockQuoteButton editor={editor}/>
              <HorizontalRuleButton editor={editor}/>
              <div className="divider"></div>
              <WrapTextButton editor={editor}/>
              <div className="divider"></div>
              <UndoButton editor={editor}/>
              <RedoButton editor={editor}/>
          </div>
      </div>
  );
}
