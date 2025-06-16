import {Router} from 'express';
import {encryptPassword, encryptValue, decryptValue, verifyPassword} from '@/components/encrypt';
import {Result} from "@/views/Result";

const router = Router();

router.post('/encrypt-password', (req, res) => {
  const {password} = req.body;
  res.json(Result.success(encryptPassword(password)));
})

router.post('/encrypt-value', (req, res) => {
  const {key, iv, data} = req.body;
  res.json(Result.success(encryptValue({key, iv}, data)));
})

router.post('/decrypt-value', (req, res) => {
  const {key, iv, data} = req.body;
  res.json(Result.success(decryptValue({key, iv}, data)));
})

router.post('/verify-password', (req, res) => {
  const {password, hash} = req.body;
  res.json(Result.success(verifyPassword(password, hash)));
})

export default router;