/**
 * Clamp.js
 * 用于处理dom元素内容溢出的问题
 * 这不是通用的解决方案，只适用于特定场景
    支持的内容结构为
    <div>
        <p></p>
        ...
    </div>
 */

(function (win) {
  function clamp(selector) {
    /**
     * @param selector string 选择器
     */
    var container = document.querySelector(selector);
    // 是否溢出
    var isOverflow = container.scrollHeight > container.clientHeight;
    if (!isOverflow) {
      return;
    }
    // 最大高度
    var maxHeight = container.clientHeight;
    // 段落
    var paragraphs = findParagraphs(container);
    // 收集段落内容高度
    var paragraphsHeightCollection = getHeightCollection(paragraphs);
    // 查找溢出的段落
    var breakParagraphIndex = findBreakParagraphIndex(
      paragraphsHeightCollection,
      maxHeight
    );
    // 删除溢出段落之后的段落
    removeParagraphs(paragraphs, breakParagraphIndex + 1);
    // 给溢出的段落添加省略号
    appendEllipsis(
      paragraphs[breakParagraphIndex],
      calculateClampHeight(
        paragraphsHeightCollection,
        breakParagraphIndex,
        maxHeight
      )
    );
  }

  function findParagraphs(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll("p")
    );
  }

  function getHeightCollection(elements) {
    return elements.map(function (node) {
      return node.scrollHeight;
    });
  }

  function findBreakParagraphIndex(heightCollection, maxHeight) {
    var i = 0;
    var totalHeight = 0;
    while (i < heightCollection.length) {
      totalHeight += heightCollection[i];
      if (totalHeight >= maxHeight) {
        return i;
      }
      i++;
    }
    return i;
  }

  function removeParagraphs(paragraphs, begin) {
    var i = begin;
    while (i < paragraphs.length) {
      paragraphs[i].parentNode.removeChild(paragraphs[i]);
      i++;
    }
  }

  function appendEllipsis(paragraph, clampHeight) {
    var style = window.getComputedStyle(paragraph);
    var width = Math.floor(parseFloat(style.width));
    var lineHeight = Math.floor(parseFloat(style.lineHeight));
    var fontSize = Math.floor(parseFloat(style.fontSize));
    // 要删除的字符数
    var deleteCharCount =
      Math.round(clampHeight / lineHeight) * Math.round(width / fontSize) - 3;

    paragraph.innerText = paragraph.innerText.slice(
      0,
      paragraph.innerText.length - deleteCharCount
    );
    paragraph.appendChild(document.createTextNode("..."));
  }
  // 计算要裁剪的高度
  function calculateClampHeight(
    heightCollection,
    breakParagraphIndex,
    maxHeight
  ) {
    var i = 0;
    var total = 0;
    while (i <= breakParagraphIndex) {
      total += heightCollection[i];
      i++;
    }
    return Math.abs(total - maxHeight);
  }

  win.fe = win.fe || {};
  win.fe.util = win.fe.util || {};
  win.fe.util.clamp = clamp;
})(window);
