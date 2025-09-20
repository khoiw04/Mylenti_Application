import * as z from "zod";
import { bannedWords } from "@/data/settings";

export const nullableSocialUsernameSchema = z
  .string()
  .trim()
  .transform(val => val === '' ? null : val.toLowerCase())
  .nullable()
  .superRefine((val, ctx) => {
    if (val === null) return; // cho phép null

    if (!val.startsWith('@')) {
      ctx.addIssue({
        code: 'custom',
        message: 'Thiếu "@" ở đầu',
      });
      return;
    }

    if (!/^@[\w]+$/.test(val)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Chỉ chứa chữ cái, số hoặc "_" sau "@"',
      });
    }
  });

export const socialUsernameSchema = z.string()
  .trim()
  .min(1, { message: 'Tên không được để trống' })
  .transform((val) => val.toLowerCase())
  .superRefine((val, ctx) => {
    if (!val) return

    if (!val.startsWith('@')) {
      ctx.addIssue({
        code: 'custom',
        message: 'Thiếu "@" ở đầu',
      });
    } else if (!/^@[\w]+$/.test(val)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Chỉ chứa chữ cái, số hoặc "_" sau "@"',
      });
    }
  });

export const nameSchema = z.string().min(1, 'Tên không được để trống')

export const passwordSchema = z.string().min(4, 'Mật khẩu phải trên 4 kí tự')

export const emailSchema = z.email('Email không hợp lệ')

export const priceSchema = z
  .string()
  .transform((val) => val.replace(/[.,đ\s]/g, ''))
  .refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 10_000;
  }, {
    message: "Giá tiền phải nằm trong khoảng từ 10.000đ"
  })
  .refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num <= 100_000_000;
  }, {
    message: "Giá tiền phải nằm trong khoảng dưới 100 triệu"
  })

export const descriptionSchema = z
  .string()
  .refine((val) => {
    const wordCount = val.trim().split(/\s+/).length;
    return wordCount >= 2 && wordCount <= 50;
  }, {
    message: "Mô tả phải từ 2 đến 50 từ"
  })
  .refine((val) => {
    const lower = val.toLowerCase();
    return !bannedWords.some((word) => lower.includes(word));
  }, {
    message: "Mô tả chứa từ ngữ không phù hợp"
  })
  .refine((val) => {
    const words = val.trim().toLowerCase().split(/\s+/);
    const wordFreq: Record<string, number> = {};
    for (const word of words) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
      if (wordFreq[word] > 5) return false; // nếu một từ xuất hiện > 5 lần
    }
    return true;
  }, {
    message: "Mô tả có dấu hiệu spam (lặp từ quá nhiều)"
  })
  .refine((val) => {
    const words = val.trim().split(/\s+/);
    for (const word of words) {
      if (word.length > 30) return false; // từ quá dài
      if (/([a-zA-Z])\1{6,}/.test(word)) return false; // lặp 1 ký tự > 6 lần
    }
    return true;
  }, {
    message: "Mô tả có dấu hiệu spam hoặc từ vô nghĩa"
  })