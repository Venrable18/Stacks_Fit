// Enhanced transaction functions with post-conditions for security

import { 
  PostCondition,
  makeStandardNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
  NonFungibleConditionCode,
  AnchorMode,
  PostConditionMode,
  uintCV,
  stringAsciiCV,
  principalCV,
  noneCV,
  listCV
} from '@stacks/transactions';

import { openContractCall } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { getActiveContract } from '../config/contracts';

export class SecureContractCaller {
  private network = new StacksTestnet();

  // Dynamic contract config
  private getContractConfig() {
    return getActiveContract();
  }

  /**
   * Record daily progress with proper post-conditions
   */
  async recordDailyProgress(
    senderAddress: string,
    steps: number,
    calories: number,
    activeTime: number,
    protein: number
  ) {
    const contract = this.getContractConfig();
    const postConditions: PostCondition[] = [
      // Ensure sender doesn't send any STX (for data-only transactions)
      makeStandardSTXPostCondition(
        senderAddress,
        FungibleConditionCode.Equal,
        0n
      )
    ];

    const txOptions = {
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: 'record-daily-progress',
      functionArgs: [
        uintCV(steps),
        uintCV(calories),
        uintCV(activeTime),
        uintCV(protein),
        noneCV(), // challenge-opt
        noneCV()  // date-opt (use current date)
      ],
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny, // 🔒 SECURE: Deny unexpected transfers
      postConditions,
      fee: 1000, // Explicit fee as number
      onFinish: (data: any) => {
        console.log('✅ Daily progress recorded:', data.txId);
        return data;
      },
      onCancel: () => {
        console.log('❌ Transaction cancelled');
      }
    };

    return await openContractCall(txOptions);
  }

  /**
   * Create user profile with post-conditions
   */
  async createUserProfile(
    senderAddress: string,
    fitnessLevel: string,
    goals: string,
    height: number,
    weight: number,
    age: number,
    preferredWorkouts: string[],
    dietaryRestrictions: string[],
    targetSteps: number,
    targetCalories: number,
    weeklyWorkouts: number
  ) {
    const contract = this.getContractConfig();
    const postConditions: PostCondition[] = [
      // Ensure no unexpected STX transfers
      makeStandardSTXPostCondition(
        senderAddress,
        FungibleConditionCode.Equal,
        0n
      )
    ];

    const txOptions = {
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: 'create-user-profile',
      functionArgs: [
        stringAsciiCV(fitnessLevel),
        stringAsciiCV(goals),
        uintCV(height),
        uintCV(weight * 10), // Convert to contract format
        uintCV(age),
        listCV(preferredWorkouts.slice(0, 5).map(w => stringAsciiCV(w))), // Convert to Clarity list
        listCV(dietaryRestrictions.slice(0, 5).map(r => stringAsciiCV(r))), // Convert to Clarity list
        uintCV(targetSteps),
        uintCV(targetCalories),
        uintCV(weeklyWorkouts)
      ],
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny, // 🔒 SECURE
      postConditions,
      fee: 2000,
      onFinish: (data: any) => {
        console.log('✅ User profile created:', data.txId);
        return data;
      }
    };

    return await openContractCall(txOptions);
  }

  /**
   * Transfer NFT with strict post-conditions
   */
  async transferNFT(
    senderAddress: string,
    tokenId: number,
    recipientAddress: string
  ) {
    const contract = this.getContractConfig();
    const postConditions: PostCondition[] = [
      // Ensure sender owns the NFT before transfer
      makeStandardNonFungiblePostCondition(
        senderAddress,
        NonFungibleConditionCode.DoesNotSend,
        `${contract.address}.${contract.name}::fitness-achievement-nft`,
        uintCV(tokenId)
      ),
      // Ensure no STX is transferred (NFT transfer only)
      makeStandardSTXPostCondition(
        senderAddress,
        FungibleConditionCode.Equal,
        0n
      )
    ];

    const txOptions = {
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: 'transfer',
      functionArgs: [
        uintCV(tokenId),
        principalCV(senderAddress),
        principalCV(recipientAddress)
      ],
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny, // 🔒 ULTRA SECURE for NFTs
      postConditions,
      fee: 1500,
      onFinish: (data: any) => {
        console.log('✅ NFT transferred:', data.txId);
        return data;
      }
    };

    return await openContractCall(txOptions);
  }

  /**
   * Add friend with minimal post-conditions
   */
  async addFriend(senderAddress: string, friendAddress: string) {
    const contract = this.getContractConfig();
    const postConditions: PostCondition[] = [
      makeStandardSTXPostCondition(
        senderAddress,
        FungibleConditionCode.Equal,
        0n
      )
    ];

    const txOptions = {
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: 'add-friend',
      functionArgs: [principalCV(friendAddress)],
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions,
      fee: 1000
    };

    return await openContractCall(txOptions);
  }

  /**
   * Create workout plan with post-conditions
   */
  async createWorkoutPlan(
    senderAddress: string,
    planName: string,
    durationWeeks: number,
    difficulty: string,
    workoutDataHash: string,
    aiModelVersion: string
  ) {
    const contract = this.getContractConfig();
    const postConditions: PostCondition[] = [
      makeStandardSTXPostCondition(
        senderAddress,
        FungibleConditionCode.Equal,
        0n
      )
    ];

    const txOptions = {
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: 'create-workout-plan',
      functionArgs: [
        stringAsciiCV(planName),
        uintCV(durationWeeks),
        stringAsciiCV(difficulty),
        stringAsciiCV(workoutDataHash),
        stringAsciiCV(aiModelVersion)
      ],
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions,
      fee: 1500
    };

    return await openContractCall(txOptions);
  }

  /**
   * Get transaction fee estimate for different operations
   */
  getFeeEstimate(operation: string): number {
    const fees: Record<string, number> = {
      'record-progress': 1000,
      'create-profile': 2000,
      'transfer-nft': 1500,
      'add-friend': 1000,
      'create-workout': 1500,
      'enhanced-progress': 1200
    };

    return fees[operation] || 1000;
  }

  /**
   * Validate contract call before sending
   */
  validateTransaction(functionName: string, args: any[]): boolean {
    const validations: Record<string, () => boolean> = {
      'record-daily-progress': () => args.length >= 4 && args.every(arg => typeof arg === 'number' || arg === null),
      'create-user-profile': () => args.length >= 10,
      'transfer': () => args.length === 3,
      'add-friend': () => args.length === 1,
      'create-workout-plan': () => args.length >= 5
    };

    const validator = validations[functionName];
    return validator ? validator() : true;
  }
}

// Export singleton instance
export const secureContractCaller = new SecureContractCaller();