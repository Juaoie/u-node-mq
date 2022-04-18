/**
 * storage加密适配器
 */
export default abstract class StorageSignAbstract {
  /**
   * 加密名称
   * @param plaintext
   */
  abstract encryptName(plaintext: string): string;
  /**
   * 加密值
   * @param plaintext
   */
  abstract encryptValue(plaintext: string): string;
  /**
   * 解密值
   * @param ciphertext
   */
  abstract decryptValue(ciphertext: string): string;
}
