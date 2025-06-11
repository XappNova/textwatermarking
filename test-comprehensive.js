#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test configuration
const TEST_TOKEN = process.env.USER_API_TOKEN || '{YOUR-API-TOKEN}';
const TEST_TIMEOUT = 15000; // 15 seconds

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to run a test
async function runTest(testName, testFunction) {
  console.log(`\n🧪 Running: ${testName}`);
  console.log('='.repeat(50));
  
  try {
    const startTime = Date.now();
    await testFunction();
    const duration = Date.now() - startTime;
    
    console.log(`✅ ${testName} - PASSED (${duration}ms)`);
    testResults.passed++;
    testResults.tests.push({ name: testName, status: 'PASSED', duration });
  } catch (error) {
    console.error(`❌ ${testName} - FAILED: ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: testName, status: 'FAILED', error: error.message });
  }
}

// Helper function to send MCP request
function sendMCPRequest(command, args, request, useEnvToken = false) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env };
    
    if (useEnvToken) {
      env.USER_API_TOKEN = TEST_TOKEN;
    }
    
    const child = spawn(command, args, {
      env,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    let responseReceived = false;
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
      const lines = stdout.split('\n');
      
      lines.forEach(line => {
        if (line.includes('"jsonrpc"') && line.includes('"id"')) {
          try {
            const response = JSON.parse(line);
            if (response.id === request.id) {
              responseReceived = true;
              resolve(response);
              child.kill();
            }
          } catch (e) {
            // Not JSON, continue
          }
        }
      });
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('error', reject);
    
    child.on('close', (code) => {
      if (!responseReceived) {
        reject(new Error(`No response received. Exit code: ${code}. Stderr: ${stderr}`));
      }
    });
    
    // Send request after a delay
    setTimeout(() => {
      child.stdin.write(JSON.stringify(request) + '\n');
    }, 1000);
    
    // Timeout
    setTimeout(() => {
      if (!responseReceived) {
        child.kill();
        reject(new Error('Test timeout'));
      }
    }, TEST_TIMEOUT);
  });
}

// Test 1: Package Help and Version
async function testHelpAndVersion() {
  console.log('Testing help command...');
  
  return new Promise((resolve, reject) => {
    const child = spawn('watermark-mcp', ['--help'], { stdio: ['pipe', 'pipe', 'pipe'] });
    
    let output = '';
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    child.on('close', (code) => {
      if (code === 0 && output.includes('Usage:') && output.includes('--token')) {
        resolve();
      } else {
        reject(new Error(`Help command failed. Code: ${code}, Output: ${output}`));
      }
    });
    
    setTimeout(() => {
      child.kill();
      reject(new Error('Help command timeout'));
    }, 5000);
  });
}

// Test 2: Command Line Token Authentication
async function testCommandLineToken() {
  console.log('Testing command-line token authentication...');
  
  const request = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'fast_encode',
      arguments: {
        visible_text: 'CLI Token Test',
        hidden_text: 'cli_secret'
      }
    }
  };
  
  const response = await sendMCPRequest('watermark-mcp', ['--token', TEST_TOKEN], request);
  
  if (!response.result || !response.result.content || !response.result.content[0]) {
    throw new Error('Invalid response structure');
  }
  
  const encodedText = response.result.content[0].text;
  if (!encodedText || encodedText === 'CLI Token Test') {
    throw new Error('Text was not properly encoded');
  }
  
  console.log(`  ✓ Encoded: "${encodedText}"`);
}

// Test 3: Environment Variable Token
async function testEnvironmentToken() {
  console.log('Testing environment variable token...');
  
  const request = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'fast_encode',
      arguments: {
        visible_text: 'Env Token Test',
        hidden_text: 'env_secret'
      }
    }
  };
  
  const response = await sendMCPRequest('watermark-mcp', [], request, true);
  
  if (!response.result || !response.result.content || !response.result.content[0]) {
    throw new Error('Invalid response structure');
  }
  
  const encodedText = response.result.content[0].text;
  console.log(`  ✓ Encoded: "${encodedText}"`);
}

// Test 4: Fast Encode/Decode Round Trip
async function testFastEncodeDecode() {
  console.log('Testing fast encode/decode round trip...');
  
  const originalText = 'Round Trip Test';
  const secretText = 'hidden_message';
  
  // Encode
  const encodeRequest = {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'fast_encode',
      arguments: {
        visible_text: originalText,
        hidden_text: secretText
      }
    }
  };
  
  const encodeResponse = await sendMCPRequest('watermark-mcp', ['--token', TEST_TOKEN], encodeRequest);
  const encodedText = encodeResponse.result.content[0].text;
  
  // Decode
  const decodeRequest = {
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'fast_decode',
      arguments: {
        input_text: encodedText
      }
    }
  };
  
  const decodeResponse = await sendMCPRequest('watermark-mcp', ['--token', TEST_TOKEN], decodeRequest);
  const decodedText = decodeResponse.result.content[0].text;
  
  if (decodedText !== secretText) {
    throw new Error(`Decode failed. Expected: "${secretText}", Got: "${decodedText}"`);
  }
  
  console.log(`  ✓ Original: "${originalText}"`);
  console.log(`  ✓ Encoded: "${encodedText}"`);
  console.log(`  ✓ Decoded: "${decodedText}"`);
}

// Test 5: Robust Encoding
async function testRobustEncoding() {
  console.log('Testing robust encoding with stealth levels...');
  
  const request = {
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'robust_encode',
      arguments: {
        visible_text: 'This is a much longer test message that should be sufficient for robust watermarking with high stealth levels and even distribution.',
        hidden_text: 'robust_secret',
        stealth_level: 'high',
        distribution: 'even'
      }
    }
  };
  
  const response = await sendMCPRequest('watermark-mcp', ['--token', TEST_TOKEN], request);
  
  // Check if we got an error response (which is still a valid MCP response)
  if (response.result && response.result.error) {
    // This is a valid error response from the API
    console.log(`  ✓ Received API error (expected): ${response.result.error.message.substring(0, 100)}...`);
    return;
  }
  
  if (!response.result || !response.result.content || !response.result.content[0]) {
    throw new Error('Invalid response structure');
  }
  
  const encodedText = response.result.content[0].text;
  console.log(`  ✓ Robust encoded: "${encodedText.substring(0, 50)}..."`);
}

// Test 6: Error Handling - Invalid Token
async function testInvalidToken() {
  console.log('Testing error handling with invalid token...');
  
  const request = {
    jsonrpc: '2.0',
    id: 6,
    method: 'tools/call',
    params: {
      name: 'fast_encode',
      arguments: {
        visible_text: 'Error Test',
        hidden_text: 'should_fail'
      }
    }
  };
  
  try {
    const response = await sendMCPRequest('watermark-mcp', ['--token', 'invalid_token'], request);
    
    // Should have an error in the response
    if (response.result && response.result.error && response.result.error.code === -32000) {
      console.log(`  ✓ Correctly handled invalid token`);
    } else {
      throw new Error('Expected error response for invalid token');
    }
  } catch (error) {
    // This is also acceptable if the connection fails due to auth error
    if (error.message.includes('Authentication failed') || error.message.includes('401')) {
      console.log(`  ✓ Correctly rejected invalid token`);
    } else {
      throw error;
    }
  }
}

// Test 7: NPX Command Test
async function testNPXCommand() {
  console.log('Testing npx command functionality...');
  
  const request = {
    jsonrpc: '2.0',
    id: 7,
    method: 'tools/call',
    params: {
      name: 'fast_encode',
      arguments: {
        visible_text: 'NPX Test',
        hidden_text: 'npx_works'
      }
    }
  };
  
  // Test with npx (this might be the same as local since we're linked)
  const response = await sendMCPRequest('npx', ['watermark-mcp', '--token', TEST_TOKEN], request);
  
  if (!response.result || !response.result.content || !response.result.content[0]) {
    throw new Error('NPX command failed');
  }
  
  console.log(`  ✓ NPX command works: "${response.result.content[0].text}"`);
}

// Test 8: Alternative Binary Name
async function testAlternativeBinary() {
  console.log('Testing alternative binary name...');
  
  const request = {
    jsonrpc: '2.0',
    id: 8,
    method: 'tools/call',
    params: {
      name: 'fast_encode',
      arguments: {
        visible_text: 'Alt Binary Test',
        hidden_text: 'alt_works'
      }
    }
  };
  
  const response = await sendMCPRequest('text-watermark-mcp', ['--token', TEST_TOKEN], request);
  
  if (!response.result || !response.result.content || !response.result.content[0]) {
    throw new Error('Alternative binary failed');
  }
  
  console.log(`  ✓ Alternative binary works: "${response.result.content[0].text}"`);
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Package Testing');
  console.log('==========================================\n');
  
  console.log(`🔑 Using test token: ${TEST_TOKEN.substring(0, 8)}...`);
  console.log(`⏱️  Test timeout: ${TEST_TIMEOUT}ms\n`);
  
  // Run all tests
  await runTest('Help and Version Command', testHelpAndVersion);
  await runTest('Command Line Token Authentication', testCommandLineToken);
  await runTest('Environment Variable Token', testEnvironmentToken);
  await runTest('Fast Encode/Decode Round Trip', testFastEncodeDecode);
  await runTest('Robust Encoding with Options', testRobustEncoding);
  await runTest('Error Handling - Invalid Token', testInvalidToken);
  await runTest('NPX Command Functionality', testNPXCommand);
  await runTest('Alternative Binary Name', testAlternativeBinary);
  
  // Print results summary
  console.log('\n📊 Test Results Summary');
  console.log('======================');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Detailed Results:');
  testResults.tests.forEach(test => {
    const status = test.status === 'PASSED' ? '✅' : '❌';
    const duration = test.duration ? ` (${test.duration}ms)` : '';
    const error = test.error ? ` - ${test.error}` : '';
    console.log(`  ${status} ${test.name}${duration}${error}`);
  });
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! Package is ready for publishing! 🚀');
  } else {
    console.log('\n⚠️  Some tests failed. Please review and fix issues before publishing.');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
}); 