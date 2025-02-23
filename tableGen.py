import pandas as pd
import numpy as np

def generate(percentErr):
    df = pd.read_csv('data/IoT_Modbus.csv')  # no need to clean the data since it's already processed!
    df.dropna(inplace=True)
    df.drop(columns=['date', 'time', 'type'], inplace=True)  # if time later use type
    X = df.drop(columns=['label'])

    # Step 1: Generate 100 synthetic data points
    synthetic_data = pd.DataFrame({
        'FC1_Read_Input_Register': np.random.randint(low=X['FC1_Read_Input_Register'].min(),
                                                    high=X['FC1_Read_Input_Register'].max(), size=100),
        'FC2_Read_Discrete_Value': np.random.randint(low=X['FC2_Read_Discrete_Value'].min(),
                                                    high=X['FC2_Read_Discrete_Value'].max(), size=100),
        'FC3_Read_Holding_Register': np.random.randint(low=X['FC3_Read_Holding_Register'].min(),
                                                    high=X['FC3_Read_Holding_Register'].max(), size=100),
        'FC4_Read_Coil': np.random.randint(low=X['FC4_Read_Coil'].min(),
                                        high=X['FC4_Read_Coil'].max(), size=100)
    })

    # Assuming 'df' is your original dataset with a 'label' column where 1 = attack
    attack_rows = df[df['label'] == 1]  # Get rows where the label is 1 (attack)

    # Randomly sample a subset of attack rows (e.g., 20 samples)
    attack_samples = attack_rows.sample(n=percentErr, random_state=42)  # Sample 20 attack rows


    # Step 2: Replace some rows in the synthetic data with attack rows
    attack_indices = np.random.choice(synthetic_data.index, size=percentErr, replace=False)  # Choose percentErr number of rows to replace

    # Replace the selected rows with the attack data
    synthetic_data.loc[attack_indices] = attack_samples[['FC1_Read_Input_Register', 'FC2_Read_Discrete_Value',
                                                        'FC3_Read_Holding_Register', 'FC4_Read_Coil']].values

    # Add the attack label for these rows
    synthetic_data.loc[attack_indices, 'label'] = 1  # Mark these rows as attacks

    for i in range(len(synthetic_data)):  # this shit so ass
        if pd.isna(synthetic_data.loc[i, 'label']):
            synthetic_data.loc[i, 'label'] = 0

    (synthetic_data['label'] == 1).sum()
    synthetic_data.drop(columns=['label'], inplace=True)
    print(synthetic_data)
    return synthetic_data