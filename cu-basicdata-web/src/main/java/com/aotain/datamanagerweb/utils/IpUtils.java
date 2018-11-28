package com.aotain.datamanagerweb.utils;

import java.io.File;
import java.math.BigInteger;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * IP相关工具集合
 * 
 * @author liuz@aotian.com
 * @date 2018年8月26日 下午1:51:02
 */
public class IpUtils {
	/** IPV4 判断正则 */
	private final static String IPV4_STAND_REGEX = "^((2[0-4]\\d)|(25[0-5])|([0-1]\\d\\d)|(\\d{1,2}))(\\.((2[0-4]\\d)|(25[0-5])|([0-1]\\d\\d)|(\\d{1,2}))){3}";
	/** IPV6 标准表示法判断正则 */
	private final static String IPV6_STAND_REGEX = "^[\\da-fA-F]{1,4}(?:\\:[\\da-fA-F]{1,4}){7}$";
	/** IPV6 0位压缩法判断正则 */
	private final static String IPV6_COMPRESS_REGEX = "^(\\:\\:)|(\\:\\:[\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){0,6}))|([\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){0,6}\\:\\:))|([\\da-fA-F]{1,4}\\:\\:[\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){0,5}))|([\\da-fA-F]{1,4}(\\:[\\da-fA-F]{1,4}){0,5}\\:\\:[\\da-fA-F]{1,4})|([\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){1})\\:\\:[\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){0,4}))|([\\da-fA-F]{1,4}(\\:[\\da-fA-F]{1,4}){0,4}\\:\\:[\\da-fA-F]{1,4}(\\:[\\da-fA-F]{1,4}){1})|([\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){2})\\:\\:[\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){0,3}))|([\\da-fA-F]{1,4}(\\:[\\da-fA-F]{1,4}){0,3}\\:\\:[\\da-fA-F]{1,4}(\\:[\\da-fA-F]{1,4}){2})|([\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){3})\\:\\:[\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){0,2}))|([\\da-fA-F]{1,4}(\\:[\\da-fA-F]{1,4}){0,2}\\:\\:[\\da-fA-F]{1,4}(\\:[\\da-fA-F]{1,4}){3})|([\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){4})\\:\\:[\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){0,1}))|([\\da-fA-F]{1,4}(\\:[\\da-fA-F]{1,4}){0,1}\\:\\:[\\da-fA-F]{1,4}(\\:[\\da-fA-F]{1,4}){4})$";
	/** IPV6 内嵌ipv4表示法判断正则 */
	private final static String IPV6_INNERV4_REGEX = "^(((\\:\\:)|([\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){0,4}\\:\\:)))(((2[0-4]\\d)|(25[0-5])|([0-1]\\d\\d)|(\\d{1,2}))(\\.((2[0-4]\\d)|(25[0-5])|([0-1]\\d\\d)|(\\d{1,2}))){3}))|((([\\da-fA-F]{1,4}(?:\\:[\\da-fA-F]{1,4}){7})|(\\:\\:[\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){0,4}))|([\\da-fA-F]{1,4}\\:\\:[\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){0,3}))|([\\da-fA-F]{1,4}(\\:[\\da-fA-F]{1,4}){0,3}\\:\\:[\\da-fA-F]{1,4})|([\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){1})\\:\\:[\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){0,2}))|([\\da-fA-F]{1,4}(\\:[\\da-fA-F]{1,4}){0,2}\\:\\:[\\da-fA-F]{1,4}(\\:[\\da-fA-F]{1,4}){1})|([\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){2})\\:\\:[\\da-fA-F]{1,4}((\\:[\\da-fA-F]{1,4}){0,1}))|([\\da-fA-F]{1,4}(\\:[\\da-fA-F]{1,4}){0,1}\\:\\:[\\da-fA-F]{1,4}(\\:[\\da-fA-F]{1,4}){2})):(((2[0-4]\\d)|(25[0-5])|([0-1]\\d\\d)|(\\d{1,2}))(\\.((2[0-4]\\d)|(25[0-5])|([0-1]\\d\\d)|(\\d{1,2}))){3}))$";

	/**
	 * 判断是不是IP地址
	 * @param ip
	 * @return
	 */
	public static boolean isIpAddress(String ip){
		if (ip == null || "".equals(ip)) {
			return false;
		}
		return ip.matches(IPV4_STAND_REGEX) || isIpv6Standard(ip) || isIpv6Compress(ip) || isIpv6InnerV4(ip);
	}

	/**
	 * ipv4判断方法
	 * 
	 * @param ip
	 * @return
	 */
	public static boolean isIpv4(String ip) {
		if (ip == null || "".equals(ip)) {
			return false;
		}
		return ip.matches(IPV4_STAND_REGEX);
	}

	/**
	 * 判断是否为IPv6
	 * 
	 * @param ip
	 * @return
	 */
	public static boolean isIpv6(String ip) {
		if (ip == null || "".equals(ip)) {
			return false;
		}
		return isIpv6Standard(ip) || isIpv6Compress(ip) || isIpv6InnerV4(ip);
	}

	/**
	 * ipv6 标准表达式的判别方法
	 * 
	 * @param ip
	 * @return
	 */
	public static boolean isIpv6Standard(String ip) {
		if (ip == null || "".equals(ip)) {
			return false;
		}
		return ip.matches(IPV6_STAND_REGEX);
	}

	/**
	 * ipv6 0位压缩表达式的判别方法
	 * 
	 * @param ip
	 * @return
	 */
	public static boolean isIpv6Compress(String ip) {
		if (ip == null || "".equals(ip)) {
			return false;
		}
		return ip.matches(IPV6_COMPRESS_REGEX);
	}

	/**
	 * ipv6 0位压缩表达式的判别方法
	 * 
	 * @param ip
	 * @return
	 */
	public static boolean isIpv6InnerV4(String ip) {
		if (ip == null || "".equals(ip)) {
			return false;
		}
		return ip.matches(IPV6_INNERV4_REGEX);
	}

	/**
	 * ipv4转内嵌ipv4的ipv6格式
	 * 
	 * @param ip
	 * @return
	 */
	public static String ipv4ToInnerV4(String ip) {
		if (isIpv4(ip)) {
			return "::" + ip;
		}
		throw new RuntimeException("ip is not ipv4 - " + ip);
	}

	/**
	 * ipv4转长整型数值
	 * 
	 * @param ip
	 * @return
	 */
	public static long ipv4ToLong(String ip) {
		if (isIpv4(ip)) {
			String[] tmpIPData = ip.split("\\.");
			long result = (Long.parseLong(tmpIPData[0]) << 24) | (Long.parseLong(tmpIPData[1]) << 16)
					| (Long.parseLong(tmpIPData[2]) << 8) | (Long.parseLong(tmpIPData[3]));
			return result;
		}
		throw new RuntimeException("ip is not ipv4 - " + ip);
	}

	/**
	 * 各种ipv6转标准表示法
	 * 
	 * @param ipv6
	 * @return
	 */
	public static String ipv6ToStardard(String ipv6) {
		if (isIpv6Standard(ipv6)) {
			return ipv6;
		}
		if (isIpv6Compress(ipv6)) {
			return ipv6CompressToStandard(ipv6, 8);
		}
		if (isIpv6InnerV4(ipv6)) {
			return ipv6InnerV4ToStandard(ipv6);
		}
		throw new RuntimeException("ip is not ipv6 - " + ipv6);
	}

	/**
	 * ipv6转成byte数组
	 * 
	 * @param ipv6
	 * @return
	 */
	public static byte[] ipv6ToBytes(String ipv6) {
		if (!isIpv6Standard(ipv6)) {
			ipv6 = ipv6ToStardard(ipv6);
		}
		String[] segs = ipv6.split("\\:");
		byte[] bvals = new byte[16];
		int i = 0;
		for (String seg : segs) {
			int ival = new Integer(Integer.parseInt(seg, 16));
			bvals[i++] = (byte) (ival >> 8 & 0xff);
			bvals[i++] = (byte) (ival & 0xff);
		}
		return bvals;
	}

	/**
	 * ipv6转成大整数
	 * 
	 * @param ipv6
	 * @return
	 */
	public static BigInteger ipv6ToBigInteger(String ipv6) {
		byte[] dest = new byte[17];
		dest[0] = 0x00;
		System.arraycopy(ipv6ToBytes(ipv6), 0, dest, 1, 16);
		return new BigInteger(dest);
	}

	/**
	 * 0位压缩转化为标准ipv6
	 * 
	 * @param ipv6
	 * @param maxLength ipv6段的长度（1-8）
	 * @return
	 */
	public static String ipv6CompressToStandard(String ipv6, int maxLength) {
		if (!isIpv6Compress(ipv6)) {
			throw new RuntimeException("ip is not ipv6 compress format - " + ipv6);
		}
		// 如果tIpv6是0位压缩类型则转化为标准形式如：FFFF:FF01::1101:cccc ::FFFF FFFF::
		String[] split = ipv6.split("\\:{1,2}");
		int segCount = split.length;
		if (ipv6.equals("::")) {
			return ipv6.replace("::", buildZoreSeg(maxLength - segCount));
		} else if (ipv6.endsWith("::")) {
			return ipv6.replace("::", ":" + buildZoreSeg(maxLength - segCount));
		} else if (ipv6.startsWith("::")) {
			return ipv6.replace("::", buildZoreSeg(maxLength - segCount + 1) + ":");
		}
		return ipv6.replace("::", ":" + buildZoreSeg(maxLength - segCount) + ":");
	}

	/**
	 * 内嵌v4的ipv6转标准形式
	 * 
	 * @param ipv6
	 * @return
	 */
	public static String ipv6InnerV4ToStandard(String ipv6) {
		if (!isIpv6InnerV4(ipv6)) {
			throw new RuntimeException("ip is not ipv6 inner-v4 format - " + ipv6);
		}
		String regexStr = "\\:{1,2}(\\d+(\\.\\d+){3})$";
		Pattern regex = Pattern.compile(regexStr);
		Matcher m = regex.matcher(ipv6);
		if (m.find()) {
			String ipv4 = m.group(1);
			String ipv6Pre = ipv6.replaceAll("\\d+(\\.\\d+){3}$", "");
			if (!ipv6Pre.endsWith("::") && ipv6Pre.endsWith(":")) {
				ipv6Pre = ipv6Pre.substring(0, ipv6Pre.length() - 1);
			}
			return ipv6CompressToStandard(ipv6Pre, 6) + ":" + ipv4ToV6Suffix(ipv4);
		}

		throw new RuntimeException("ip is not ipv6 inner-v4 format - " + ipv6);
	}

	/**
	 * long转ip
	 * 
	 * @param longValue
	 * @return
	 */
	public static String parseIpv4(long longValue) {
		if (longValue < 0 || longValue > 0xffffffffL) {
			throw new RuntimeException("longValue is out of range of ipv4 - " + longValue);
		}
		int ip1 = (int) (longValue >> 24) & 0xff;
		int ip2 = (int) (longValue >> 16) & 0xff;
		int ip3 = (int) (longValue >> 8) & 0xff;
		int ip4 = (int) longValue & 0xff;
		return ip1 + "." + ip2 + "." + ip3 + "." + ip4;
	}

	/**
	 * 转成ipv6标准形式（缩写形式）
	 * 
	 * @param bigIntValue
	 * @param upperCase true-大写；false-小写
	 * @return
	 */
	public static String parseIpv6(BigInteger bigIntValue, boolean upperCase) {
		String hexStr = leftZeroize(bigIntValue.toString(16), 32);
		char[] chars = hexStr.toCharArray();
		StringBuilder ipv6Builder = new StringBuilder();
		boolean needShortZore = true;
		for (int i = 0; i < chars.length; i++) {
			if (0 == i % 4) {
				if (i / 4 > 0) {
					ipv6Builder.append(":");
				}
				if ('0' != chars[i]) {
					ipv6Builder.append(chars[i]);
					needShortZore = false;
				}
			} else if (1 == i % 4) {
				if (!needShortZore || (needShortZore && '0' != chars[i])) {
					ipv6Builder.append(chars[i]);
					needShortZore = false;
				}
			} else if (2 == i % 4) {
				if (!needShortZore || (needShortZore && '0' != chars[i])) {
					ipv6Builder.append(chars[i]);
					needShortZore = false;
				}
			} else {
				ipv6Builder.append(chars[i]);
				needShortZore = true;
			}
		}

		if (upperCase) {
			return ipv6Builder.toString().toUpperCase();
		}
		return ipv6Builder.toString().toLowerCase();
	}

	/**
	 * 转成ipv6标准形式
	 * 
	 * @param bigIntValue
	 * @param upperCase
	 * @return
	 */
	public static String parseIpv6(byte[] bytes, boolean upperCase) {
		byte[] dest = new byte[17];
		dest[0] = 0x00;
		System.arraycopy(bytes, 0, dest, 1, 16);
		return parseIpv6(new BigInteger(dest), upperCase);
	}

	/**
	 * 转成ipv6压缩格式
	 * 
	 * @param bytes
	 * @param upperCase
	 * @return
	 */
	public static String parseIpv6Compress(byte[] bytes, boolean upperCase) {
		String ipv6Std = parseIpv6(bytes, upperCase);
		return compressIpv6(ipv6Std);
		// java不支持正向肯定、正向否定、逆向肯定、逆向否定的语法
	/*	if (ipv6Std.matches("^0{1,4}(\\:0){7}$")) { // 0:0:0:0:0:0:0:0
			return "::";
		}
		if (ipv6Std.matches("(?<![1-9a-fA-F])0{1,4}(\\:0{1,4}){0,6}$")) { // 0:0:0:0:0:0:1:2
			return ":" + ipv6Std.replaceAll("(?<![1-9a-fA-F])0{1,4}(\\:0{1,4}){0,6}$", "");
		}
		if (ipv6Std.matches("^0{1,4}(\\:0){0,6}")) { // 1:2:0:0:0:0:0:0
			return ipv6Std.replaceAll("^0{1,4}(\\:0){0,6}", "") + ":";
		}
		// 1:0:0:0:0:0:0:2
		return ipv6Std.replaceAll("(?<![1-9a-fA-F])0{1,4}(\\:0{1,4}){0,5}(?![1-9a-fA-F])", "");*/
	}

	/**
	 * 转成ipv6内嵌ipv4格式
	 * 
	 * @param bytes
	 * @param upperCase
	 * @return
	 */
	public static String parseIpv6InnerV4(byte[] bytes, boolean upperCase) {
		String ipv6Std = parseIpv6(bytes, upperCase).replaceAll("(\\:[a-fA-f\\d]{1,4}){1,2}$", "");
		long ipv4LongValue = (bytes[bytes.length - 4] << 24 & 0xff000000L) | (bytes[bytes.length - 3] << 16 & 0x00ff0000L)
				| (bytes[bytes.length - 2] << 8 & 0x0000ff00L) | (bytes[bytes.length - 1] & 0xff0000ffL);
		String ipv4Value = parseIpv4(ipv4LongValue);
		return compressIpv6(ipv6Std) + ipv4Value;
	}

	/**
	 * 压缩ipv6算法
	 * @param ipv6Std ipv6或者前缀
	 * @return
	 */
	private static String compressIpv6(String ipv6Std) {
		String[] segs = ipv6Std.split("\\:");
		int status = 0; // 0-初始，1-开始压缩，2-压缩完成
		StringBuilder sb = new StringBuilder();
		for(String seg : segs) {
			if(status == 0 && seg.matches("0{1,4}")){
				// 此时开始执行压缩，丢弃此段
				status = 1;
			}
			else if(status == 1 && seg.matches("0{1,4}")){
				continue; // 执行压缩
			}
			// 压缩中发现，不可压缩的段，结束压缩
			else if(status == 1 && !seg.matches("0{1,4}")){
				sb.append("::").append(seg);
				status = 2; 
			}else{
				if(sb.length() > 0){
					sb.append(":");
				}
				sb.append(seg);
			}
		}
		if(status == 0){
			if(segs.length == 8){
				return sb.toString();
			}else{
				return sb.append(":").toString();
			}
		}
		// 未压缩结束，表示末尾缺少"::"
		if(status == 1){ // 0:0:0:0:0:0:0:0 -> :: 或者 10:0:0:0:0:0:0:0 -> 10::
			return sb.append("::").toString();
		}
		// status == 2
		if(segs.length == 8){
			return sb.toString();
		}else{
			return sb.append(":").toString();
		}
	}

	/**
	 * ipv4转IPv6后缀
	 * 
	 * @param ipv4
	 * @return
	 */
	private static String ipv4ToV6Suffix(String ipv4) {
		if (!isIpv4(ipv4)) {
			throw new RuntimeException("ip is not ipv4 - " + ipv4);
		}
		String[] ipv4Arr = ipv4.split("\\.");
		int i1 = Integer.parseInt(ipv4Arr[0]) << 8 | Integer.parseInt(ipv4Arr[1]);
		int i2 = Integer.parseInt(ipv4Arr[2]) << 8 | Integer.parseInt(ipv4Arr[3]);
		return Integer.toHexString(i1) + ":" + Integer.toHexString(i2);
	}

	/**
	 * 将小于maxLength的字符串，用字符0填充至maxLength
	 * 
	 * @param str
	 * @param maxLength
	 * @return
	 */
	private static String leftZeroize(String str, int maxLength) {
		if (null == str) {
			str = "";
		}
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < (maxLength - str.length()); i++) {
			sb.append('0');
		}
		sb.append(str);
		return sb.toString();
	}

	/**
	 * 构造cnt个 值为0 的ipv6区段
	 * 
	 * @param cnt
	 * @return
	 */
	private static String buildZoreSeg(int cnt) {
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < cnt; i++) {
			if (i > 0) {
				sb.append(":");
			}
			sb.append("0000");
		}
		return sb.toString();
	}

	public static void main(String[] args) {
		// ip 格式判断测试
		/*List<String> ipList = FileUtils.readFileByLine(new
		File("config/ip-store.txt")); */
		List<String> ipList = null;
		testIp(ipList); 
		testIpv4(ipList);
		testIpv6Standard(ipList); 
		testIpv6Compress(ipList);
		testIpv6Inner(ipList);
		
		// ipv4 -> ipv6 innerv4
		System.out.println("ipv4测试");
		System.out.println("1.2.3.4 ->(inner v4)"+ipv4ToInnerV4("1.2.3.4"));
		System.out.println("1.2.3.4 ->(long)"+ipv4ToLong("1.2.3.4"));
		System.out.println("123213 ->(ipv4) " + parseIpv4(123213L));
		System.out.println("0xffffffffL ->(ipv4) " + parseIpv4(0xffffffffL));
		//System.out.println("0x1ffffffffL ->(ipv4) " + parseIpv4(0x1ffffffffL)); // 无效测试

		// ipv6转标准
		System.out.println("ipv6向标准形式转换(此处的转换结果不区分缩写与否)============");
		System.out.println("::1.2.3.4 -> "+ipv6ToStardard("::1.2.3.4"));
		System.out.println("8FA:ff::12:254.2.255.235 ->" + ipv6ToStardard("8FA:ff::12:254.2.255.235"));
		System.out.println("8a88:132:12::1.2.3.4 ->(bigint) " + ipv6ToBigInteger(ipv6ToStardard("8a88:132:12::1.2.3.4")));
		System.out.println("184139640034918617047845888769071907588 ->" + parseIpv6(new BigInteger("184139640034918617047845888769071907588"), false));
		System.out.println("9f88:f1f2:81f2::246.2.3.4 -> (bytes test)"+parseIpv6(ipv6ToBytes((ipv6ToStardard("9f88:f1f2:81f2::246.2.3.4"))), true));
		
		System.out.println("ipv6压缩============");
		System.out.println("9f88:f1f2:81f2::1.1.1.1 -> "+parseIpv6Compress(ipv6ToBytes("9f88:f1f2:81f2::1.1.1.1"), false));
		System.out.println("9f88:f1f2:81f2:0000:0000:0000:101:101 -> "+parseIpv6Compress(ipv6ToBytes("9f88:f1f2:81f2:0000:0000:0000:101:101"), false));
		System.out.println("9f88:f1f2:81f0:0000:0000:0000:001:101 -> "+parseIpv6Compress(ipv6ToBytes("9f88:f1f2:81f0:0000:0000:0000:001:101"), false));
		System.out.println("0:0:0:0000:0000:0000:001:101 -> "+parseIpv6Compress(ipv6ToBytes("0:0:0:0000:0000:0000:001:101"), false));
		System.out.println("10:100:200:0:0:0000:0000:0000 -> "+parseIpv6Compress(ipv6ToBytes("10:100:200:0:0:0000:0000:0000"), false));
		System.out.println("10:100:200:0:0:0100:0000:0000 -> "+parseIpv6Compress(ipv6ToBytes("10:100:200:0:0:0100:0000:0000"), false));

		System.out.println("ipv6内嵌表示测试============");
		System.out.println("10:100:200:0:0:0100:0000:0000 -> "+parseIpv6InnerV4(ipv6ToBytes("10:100:200:0:0:0100:0000:0000"), false));
		System.out.println("10:100:200:0:0:0100:ff0f:0f22 -> "+parseIpv6InnerV4(ipv6ToBytes("10:100:200:0:0:0100:ff0f:0f22"), false));
	}

	private static void testIp(List<String> ipList) {
		for (String ip : ipList) {
			if (isIpv4(ip)) {
				System.out.println("ipv4 - " + ip);
			} else if (isIpv6Standard(ip)) {
				System.out.println("ipv6 standard - " + ip);
			} else if (isIpv6Compress(ip)) {
				System.out.println("ipv6 compress - " + ip);
			} else if (isIpv6InnerV4(ip)) {
				System.out.println("ipv6 inner v4 - " + ip);
			} else {
				System.out.println("not ip - " + ip);
			}
		}
	}

	private static void testIpv4(List<String> ipList) {
		long st = System.currentTimeMillis();
		for (String ip : ipList) {
			isIpv4(ip);
		}
		System.out.println("ipv4 takes : " + (System.currentTimeMillis() - st) + " ms");
	}

	private static void testIpv6Standard(List<String> ipList) {
		long st = System.currentTimeMillis();
		for (String ip : ipList) {
			isIpv6Standard(ip);
		}
		System.out.println("ipv6 standard takes : " + (System.currentTimeMillis() - st) + " ms");
	}

	private static void testIpv6Compress(List<String> ipList) {
		long st = System.currentTimeMillis();
		for (String ip : ipList) {
			isIpv6Standard(ip);
		}
		System.out.println("ipv6 compress takes : " + (System.currentTimeMillis() - st) + " ms");
	}

	private static void testIpv6Inner(List<String> ipList) {
		long st = System.currentTimeMillis();
		for (String ip : ipList) {
			isIpv6Standard(ip);
		}
		System.out.println("ipv6 inner v4 takes : " + (System.currentTimeMillis() - st) + " ms");
	}
	
	/**
	 * 将起始和终止IP装化成IPV6整型，从而比较起始和终止的大小
	 * 
	 * @author : songl
	 */
	public static Boolean isStartIPOverEndIp(String startIP,String endIP){
		BigInteger startNum;
		BigInteger endNUm;
		if(IpUtils.isIpv4(startIP)){
			startNum = BigInteger.valueOf(IpUtils.ipv4ToLong(startIP));
		}else{
			startNum = IpUtils.ipv6ToBigInteger(startIP);
		}
		if(IpUtils.isIpv4(endIP)){
			endNUm = BigInteger.valueOf(IpUtils.ipv4ToLong(endIP));
		}else{
			endNUm = IpUtils.ipv6ToBigInteger(endIP);
		}
		if(endNUm.subtract(startNum).signum()==-1){
			return true;
		}
		return false;
	}
}
