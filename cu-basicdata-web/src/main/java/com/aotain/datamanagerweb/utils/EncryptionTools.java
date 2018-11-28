package com.aotain.datamanagerweb.utils;

import org.apache.commons.codec.binary.Hex;
import org.apache.commons.lang3.StringUtils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import javax.crypto.Cipher;
import java.security.Key;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

public class EncryptionTools {
	
	private static KeyPair keyPair;
	
	static {
		KeyPairGenerator keyPairGenerator = null;
		try {
			keyPairGenerator = KeyPairGenerator.getInstance("RSA");
			keyPairGenerator.initialize(1024);
			keyPair = keyPairGenerator.generateKeyPair();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
	}

	public static RSAPrivateKey gernatePrivateKey() {
		return (RSAPrivateKey) keyPair.getPrivate();
	}
	
	public static RSAPublicKey gernatePublicKey() {
		return (RSAPublicKey) keyPair.getPublic();
	}
	
	public static String gernatePublicKeyExponent() {
		return gernatePublicKey().getPublicExponent().toString(16);
	}
	
	public static String gernatePublicKeyModulus() {
		return gernatePublicKey().getModulus().toString(16);
	}
	
	public static String decryptedString(Key key, String str) {
		Cipher ci;
		try {
			ci = Cipher.getInstance("RSA", new BouncyCastleProvider());
			ci.init(Cipher.DECRYPT_MODE, key);
			byte[] en_data = Hex.decodeHex(str.toCharArray());
            return StringUtils.reverse(new String(ci.doFinal(en_data))); //反转字符串
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
}
