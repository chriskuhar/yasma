'use client'
//import styles from '@/app/components/Toolbar.module.css';
import styles from './Toolbar.module.css';
//import styles from "./main.module.css";
import React from 'react'
import classNames from 'classnames'
import { Editor } from '@tiptap/react'
import { useInView } from 'react-cool-inview'
import {
    RiBold,
    RiItalic,
    RiStrikethrough,
    RiCodeSSlashLine,
    RiH1,
    RiH2,
    RiH3,
    RiParagraph,
    RiListOrdered,
    RiListUnordered,
    RiCodeBoxLine,
    RiLink,
    RiLinkUnlink,
    RiDoubleQuotesL,
    RiSeparator,
    RiTextWrap,
    RiFormatClear,
    RiArrowGoBackLine,
    RiArrowGoForwardLine,
} from 'react-icons/ri'

import { setLink } from '@/app/components/helpers/set-link';

type ToolbarProps = {
    editor: Editor
}

export function ComposeEditorToolbar({ editor } : ToolbarProps) {
    const isCursorOverLink = editor.getAttributes('link').href

    const { observe, inView } = useInView({
        rootMargin: '-1px 0px 0px 0px',
        threshold: [1],
    })

  return (
      <div className={`${styles.ToolbarContainer} ${!inView ? "styles.sticky" : ""} flex-none`} ref={observe}>
          <div className="flex justify-center align-center">
              <div className={styles.icon} onClick={() => editor.chain().focus().toggleBold().run()}>
                  <RiBold/>
              </div>
              <div className={styles.icon} onClick={() => editor.chain().focus().toggleItalic().run()}>
                  <RiItalic/>
              </div>
              <div className={styles.icon} onClick={() => editor.chain().focus().toggleStrike().run()}>
                  <RiStrikethrough/>
              </div>
              <div className={styles.icon} onClick={() => editor.chain().focus().toggleCode().run()}>
                  <RiCodeSSlashLine/>
              </div>
              <div
                  className={styles.icon}
                  onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}>
                  <RiH1/>
              </div>
              <div
                  className={styles.icon}
                  onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}>
                  <RiH2/>
              </div>
              <div
                  className={styles.icon}
                  onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}>
                  <RiH3/>
              </div>
              <div className={styles.icon} onClick={() => editor.chain().focus().setParagraph().run()}>
                  <RiParagraph/>
              </div>
              <div
                  className={styles.icon}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}>
                  <RiListOrdered/>
              </div>
              <div
                  className={styles.icon}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                  <RiListUnordered/>
              </div>
              <div
                  className={styles.icon}
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
                  <RiCodeBoxLine/>
              </div>
              <div className="divider"></div>
              <div className={styles.icon} onClick={() => setLink(editor)}>
                  <RiLink/>
              </div>
              <div
                  className={classNames('icon', {disabled: !isCursorOverLink})}
                  onClick={() => setLink(editor)}>
                  <RiLinkUnlink/>
              </div>
              <div className="divider"></div>
              <div
                  className={styles.icon}
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                  <RiDoubleQuotesL/>
              </div>
              <div
                  className={styles.icon}
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                  <RiSeparator/>
              </div>
              <div className="divider"></div>
              <div className={styles.icon} onClick={() => editor.chain().focus().setHardBreak().run()}>
                  <RiTextWrap/>
              </div>
              <div
                  className={styles.icon}
                  onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
                  <RiFormatClear/>
              </div>
              <div className="divider"></div>
              <div className={styles.icon} onClick={() => editor.chain().focus().undo().run()}>
                  <RiArrowGoBackLine/>
              </div>
              <div className={styles.icon} onClick={() => editor.chain().focus().redo().run()}>
                  <RiArrowGoForwardLine/>
              </div>
          </div>
      </div>
  );
}
