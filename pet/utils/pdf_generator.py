"""
PDF生成工具
将文本文档转换为PDF格式
"""

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch
import os

def convert_txt_to_pdf(txt_path: str, pdf_path: str) -> None:
    """
    将文本文件转换为PDF
    Args:
        txt_path: 文本文件路径
        pdf_path: 输出PDF路径
    """
    # 读取文本内容
    with open(txt_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 创建PDF文档
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # 创建故事（内容流）
    story = []
    
    # 设置样式
    styles = getSampleStyleSheet()
    normal_style = styles['Normal']
    title_style = styles['Heading1']
    heading2_style = styles['Heading2']
    
    # 处理Markdown格式
    lines = content.split('\n')
    current_list = []
    
    for line in lines:
        if line.startswith('# '):  # 主标题
            if current_list:
                story.extend(current_list)
                current_list = []
            story.append(Paragraph(line[2:], title_style))
            story.append(Spacer(1, 12))
        elif line.startswith('## '):  # 二级标题
            if current_list:
                story.extend(current_list)
                current_list = []
            story.append(Paragraph(line[3:], heading2_style))
            story.append(Spacer(1, 12))
        elif line.startswith('### '):  # 三级标题
            if current_list:
                story.extend(current_list)
                current_list = []
            story.append(Paragraph(line[4:], heading2_style))
            story.append(Spacer(1, 12))
        elif line.startswith('- '):  # 列表项
            current_list.append(Paragraph('• ' + line[2:], normal_style))
        elif line.strip() == '':  # 空行
            if current_list:
                story.extend(current_list)
                current_list = []
            story.append(Spacer(1, 12))
        else:  # 普通段落
            if current_list:
                story.extend(current_list)
                current_list = []
            if line.strip():
                story.append(Paragraph(line, normal_style))
                story.append(Spacer(1, 6))
    
    # 处理最后的列表项（如果有）
    if current_list:
        story.extend(current_list)
    
    # 生成PDF
    doc.build(story)

if __name__ == '__main__':
    # 获取当前脚本所在目录的父目录
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    txt_path = os.path.join(base_dir, '使用文档.txt')
    pdf_path = os.path.join(base_dir, '使用文档.pdf')
    
    # 转换文档
    convert_txt_to_pdf(txt_path, pdf_path)
    print(f"PDF文档已生成：{pdf_path}")